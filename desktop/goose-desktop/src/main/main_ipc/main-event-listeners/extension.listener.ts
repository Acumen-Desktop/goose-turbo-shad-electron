import { ipcMain, IpcMainEvent } from 'electron';
import { extensionManager } from '../../../extensions/mcp_extension_manager';
import log from '../../../utils/logger';
import { IPC } from '../ipc-channels';
import { ExtensionInstallOptions, IPCMainListener } from '../types';
import type {
	McpExtensionRegisterParams,
	McpToolExecuteParams,
	McpToolListParams
} from '../types/extension.types';

function isValidExtensionUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.protocol === 'goose:';
	} catch (e) {
		return false;
	}
}

/**
 * Parse a goose:// extension URL into an extension configuration
 */
function parseExtensionUrl(url: string): { success: boolean; config?: any; error?: string } {
	try {
		if (!url.startsWith('goose://extension')) {
			return { success: false, error: 'Invalid URL: URL must use the goose://extension scheme' };
		}

		const parsedUrl = new URL(url);

		// Check required fields
		const requiredFields = ['name', 'description', 'id'];
		for (const field of requiredFields) {
			const value = parsedUrl.searchParams.get(field);
			if (!value || value.trim() === '') {
				return {
					success: false,
					error: `Missing required field: ${field}`
				};
			}
		}

		// Get command and args
		const cmd = parsedUrl.searchParams.get('cmd');
		if (!cmd) {
			return { success: false, error: "Missing required 'cmd' parameter" };
		}

		// Validate allowed commands
		const allowedCommands = ['npx', 'uvx', 'goosed'];
		if (!allowedCommands.includes(cmd)) {
			return {
				success: false,
				error: `Invalid command: ${cmd}. Only ${allowedCommands.join(', ')} are allowed.`
			};
		}

		// Get args and env vars
		const args = parsedUrl.searchParams.getAll('arg');
		const envList = parsedUrl.searchParams.getAll('env');
		const id = parsedUrl.searchParams.get('id');
		const name = parsedUrl.searchParams.get('name');
		const description = parsedUrl.searchParams.get('description');

		// Security check for npx -c
		if (cmd === 'npx' && args.includes('-c')) {
			return {
				success: false,
				error: 'Security risk: npx with -c argument can lead to code injection'
			};
		}

		// Split env vars
		const env_keys = envList.map((env) => env.split('=')[0]);

		// Create config object
		const config = {
			name,
			type: 'stdio',
			cmd,
			args,
			env_keys: env_keys.length > 0 ? env_keys : [],
			tools: [] // Will be populated by the extension system
		};

		return { success: true, config };
	} catch (error) {
		return {
			success: false,
			error: `Failed to parse extension URL: ${error instanceof Error ? error.message : 'Unknown error'}`
		};
	}
}

// Handle extension installation from URL
const handleExtensionInstall = async (event: IpcMainEvent, options: ExtensionInstallOptions) => {
	try {
		const { url } = options;

		if (!url || !isValidExtensionUrl(url)) {
			// Use the same channel for response as we don't have a specific result channel
			event.sender.send(IPC.EXTENSION.INSTALL_URL, {
				success: false,
				message: 'Invalid extension URL'
			});
			return;
		}

		// Parse the URL and register the extension
		const parsed = parseExtensionUrl(url);
		if (!parsed.success || !parsed.config) {
			event.sender.send(IPC.EXTENSION.INSTALL_URL, {
				success: false,
				message: parsed.error || 'Failed to parse extension URL'
			});
			return;
		}

		// Register the extension
		const result = await extensionManager.registerExtension(parsed.config);

		event.sender.send(IPC.EXTENSION.INSTALL_URL, {
			success: result.success,
			message: result.message
		});
	} catch (error) {
		log.error('Error installing extension:', error);
		event.sender.send(IPC.EXTENSION.INSTALL_URL, {
			success: false,
			message: error instanceof Error ? error.message : 'Unknown error occurred'
		});
	}
};

export function registerExtensionListeners(): () => void {
	// Register extension installation listener
	ipcMain.on(IPC.EXTENSION.INSTALL_URL, handleExtensionInstall);

	// Register MCP handlers
	ipcMain.handle(IPC.EXTENSION.MCP.EXECUTE_TOOL, async (_, params: McpToolExecuteParams) => {
		try {
			const result = await extensionManager.executeTool(
				params.extensionName,
				params.toolName,
				params.params
			);
			return { result };
		} catch (error) {
			log.error('Error executing tool:', error);
			return {
				result: {
					error: true,
					data: error instanceof Error ? error.message : 'Unknown error occurred'
				}
			};
		}
	});

	ipcMain.handle(IPC.EXTENSION.MCP.LIST_TOOLS, async (_, params?: McpToolListParams) => {
		try {
			const extensionMap = extensionManager.listExtensions();
			const tools = [];

			// Serialize tools - omitting execute function to avoid serialization issues
			if (params?.extensionName) {
				const extensionTools = extensionMap[params.extensionName] || [];
				for (const tool of extensionTools) {
					tools.push({
						name: tool.name,
						description: tool.description || '',
						parameters: tool.parameters || []
						// Deliberately omit execute function
					});
				}
			} else {
				for (const [extName, extensionTools] of Object.entries(extensionMap)) {
					for (const tool of extensionTools) {
						tools.push({
							name: tool.name,
							description: tool.description || '',
							parameters: tool.parameters || [],
							extensionName: extName
							// Deliberately omit execute function
						});
					}
				}
			}

			return { tools };
		} catch (error) {
			log.error('Error listing tools:', error);
			return { tools: [] };
		}
	});

	ipcMain.handle(
		IPC.EXTENSION.MCP.REGISTER_EXTENSION,
		async (_, params: McpExtensionRegisterParams) => {
			try {
				// Handle URL-based extension registration
				if (params.url) {
					const url = params.url;
					if (!isValidExtensionUrl(url)) {
						return {
							result: {
								success: false,
								message: 'Invalid extension URL format'
							}
						};
					}

					// Parse the URL into a config
					const parsed = parseExtensionUrl(url);
					if (!parsed.success || !parsed.config) {
						return {
							result: {
								success: false,
								message: parsed.error || 'Failed to parse extension URL'
							}
						};
					}

					// Register with the parsed config
					const result = await extensionManager.registerExtension(parsed.config);
					return { result };
				}

				// Handle config-based extension registration
				if (params.config) {
					const result = await extensionManager.registerExtension(params.config);
					return { result };
				}

				// If we get here, neither url nor config was provided
				return {
					result: {
						success: false,
						message: 'Either url or config must be provided'
					}
				};
			} catch (error) {
				log.error('Error registering extension:', error);
				return {
					result: {
						success: false,
						message: error instanceof Error ? error.message : 'Unknown error occurred'
					}
				};
			}
		}
	);

	ipcMain.handle(IPC.EXTENSION.MCP.LIST_EXTENSIONS, async () => {
		try {
			const extensionMap = extensionManager.listExtensions();
			// Convert the extension map to an array of configs
			const extensions = Object.entries(extensionMap).map(([name, tools]) => ({
				name,
				type: 'builtin',
				tools: tools.map((tool) => ({
					name: tool.name,
					description: tool.description || '',
					parameters: tool.parameters || []
				}))
			}));
			return { extensions };
		} catch (error) {
			log.error('Error listing extensions:', error);
			return { extensions: [] };
		}
	});

	// Listen for the add-extension event from the main process
	ipcMain.on('add-extension', async (event: IpcMainEvent, url: string) => {
		try {
			if (!url || !isValidExtensionUrl(url)) {
				log.error('Invalid extension URL:', url);
				return;
			}

			log.info('Received extension URL:', url);

			// Parse the URL and register the extension
			const parsed = parseExtensionUrl(url);
			if (!parsed.success || !parsed.config) {
				log.error('Failed to parse extension URL:', parsed.error);
				return;
			}

			// Register the extension
			const result = await extensionManager.registerExtension(parsed.config);
			log.info('Extension registration result:', result);
		} catch (error) {
			log.error('Error handling add-extension event:', error);
		}
	});

	// Return cleanup function
	return () => {
		ipcMain.removeListener(IPC.EXTENSION.INSTALL_URL, handleExtensionInstall);
		ipcMain.removeHandler(IPC.EXTENSION.MCP.EXECUTE_TOOL);
		ipcMain.removeHandler(IPC.EXTENSION.MCP.LIST_TOOLS);
		ipcMain.removeHandler(IPC.EXTENSION.MCP.REGISTER_EXTENSION);
		ipcMain.removeHandler(IPC.EXTENSION.MCP.LIST_EXTENSIONS);
		ipcMain.removeListener('add-extension', () => {});
	};
}
