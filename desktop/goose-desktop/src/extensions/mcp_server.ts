/**
 * MCP server integration
 */

import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	McpError,
	Server,
	StdioServerTransport
} from '@modelcontextprotocol/sdk';
import type { McpRequest, Tool, ToolResult } from './mcp_core_types';
import { createToolError, ErrorCode } from './mcp_error_utils';
import { createExtensionManager, extensionManager } from './mcp_extension_manager';

// Request parameter types
interface ListToolsParams {
	filter?: string;
}

interface CallToolParams {
	name: string;
	arguments: Record<string, unknown>;
}

/**
 * Creates and configures an MCP server instance
 */
export const createMcpServer = () => {
	const server = new Server(
		{
			name: 'goose-extension-server',
			version: '1.0.0'
		},
		{
			capabilities: {
				tools: {},
				resources: {}
			}
		}
	);

	/**
	 * Sets up the server request handlers
	 */
	const setupHandlers = () => {
		// Handle tool listing requests
		server.setRequestHandler(
			ListToolsRequestSchema,
			async (request: McpRequest<ListToolsParams>) => {
				const extensions = extensionManager.listExtensions();
				const tools = [];

				for (const [extName, toolNames] of Object.entries(extensions)) {
					for (const tool of toolNames) {
						const toolInfo = extensionManager.getToolInfo(extName, tool.name);
						if (toolInfo) {
							tools.push({
								name: toolInfo.name,
								description: toolInfo.description,
								parameters: toolInfo.parameters
							});
						}
					}
				}

				return { tools };
			}
		);

		// Handle tool execution requests
		server.setRequestHandler(CallToolRequestSchema, async (request: McpRequest<CallToolParams>) => {
			const [extensionName, toolName] = request.params.name.split('.');

			if (!extensionName || !toolName) {
				throw new McpError(
					ErrorCode.INVALID_PARAMS,
					'Invalid tool name format. Expected: extension.tool'
				);
			}

			const result = await extensionManager.executeTool(
				extensionName,
				toolName,
				request.params.arguments
			);

			if (result.error) {
				throw new McpError(ErrorCode.EXECUTION_FAILED, result.prompt || 'Tool execution failed');
			}

			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(result.data)
					}
				]
			};
		});
	};

	/**
	 * Starts the MCP server
	 */
	const start = async () => {
		try {
			setupHandlers();
			const transport = new StdioServerTransport();
			await server.connect(transport);
			console.log('MCP server started successfully');
		} catch (error) {
			console.error('Failed to start MCP server:', error);
			throw error;
		}
	};

	/**
	 * Stops the MCP server
	 */
	const stop = async () => {
		try {
			await server.close();
			console.log('MCP server stopped successfully');
		} catch (error) {
			console.error('Failed to stop MCP server:', error);
			throw error;
		}
	};

	/**
	 * Registers a tool with both the extension manager and server
	 */
	const registerTool = async (extensionName: string, tool: Tool): Promise<ToolResult> => {
		try {
			const result = await extensionManager.registerExtension({
				type: 'builtin',
				name: extensionName,
				tools: [tool]
			});

			if (!result.success) {
				throw new Error(result.message);
			}

			return {
				error: false,
				data: {
					message: `Tool ${tool.name} registered successfully`,
					extensionName,
					toolName: tool.name
				}
			};
		} catch (error) {
			return createToolError(
				ErrorCode.EXECUTION_FAILED,
				`Failed to register tool: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	};

	return {
		start,
		stop,
		registerTool,
		extensionManager
	};
};

/**
 * Creates a singleton MCP server instance
 */
let mcpServerInstance: ReturnType<typeof createMcpServer> | null = null;

export const getMcpServer = () => {
	if (!mcpServerInstance) {
		mcpServerInstance = createMcpServer();
	}
	return mcpServerInstance;
};
