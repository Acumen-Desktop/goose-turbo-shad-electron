import { ipcMain, IpcMainEvent } from 'electron';
import { IPC } from '../ipc-channels';
import { IPCMainListener, ExtensionInstallOptions } from '../types';
import { createExtensionManager } from '../../../extensions/mcp_extension_manager';
import type {
  McpToolExecuteParams,
  McpToolListParams,
  McpExtensionRegisterParams
} from '../types/extension.types';
import log from '../../../utils/logger';

// Create extension manager instance
const extensionManager = createExtensionManager();

function isValidExtensionUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Add any specific extension URL validation if needed
    return true;
  } catch (e) {
    return false;
  }
}

const handleExtensionInstall: IPCMainListener<ExtensionInstallOptions> = (
  event: IpcMainEvent,
  { url, name }: ExtensionInstallOptions
) => {
  try {
    if (!url?.trim()) {
      throw new Error('Empty extension URL received');
    }

    if (!isValidExtensionUrl(url)) {
      throw new Error('Invalid extension URL format');
    }

    const mockEvent = {
      preventDefault: () => {
        log.info('Default handling prevented for extension URL');
      },
    };

    // Re-emit as an open-url event which is handled by the app
    event.sender.send('open-url', mockEvent, url);

    log.info(`Extension installation initiated for: ${name || url}`);
  } catch (error) {
    log.error('Error handling extension installation:', error);
    event.sender.send('extension-install-error', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error'
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
      const tools = [];
      const extensions = extensionManager.listExtensions();
      
      if (params?.extensionName) {
        tools.push(...(extensions[params.extensionName] || []));
      } else {
        for (const extensionTools of Object.values(extensions)) {
          tools.push(...extensionTools);
        }
      }
      
      return { tools };
    } catch (error) {
      log.error('Error listing tools:', error);
      return { tools: [] };
    }
  });

  ipcMain.handle(IPC.EXTENSION.MCP.REGISTER_EXTENSION, async (_, params: McpExtensionRegisterParams) => {
    try {
      const result = await extensionManager.registerExtension(params.config);
      return { result };
    } catch (error) {
      log.error('Error registering extension:', error);
      return {
        result: {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  });

  ipcMain.handle(IPC.EXTENSION.MCP.LIST_EXTENSIONS, async () => {
    try {
      const extensionMap = extensionManager.listExtensions();
      // Convert the extension map to an array of configs
      const extensions = Object.entries(extensionMap).map(([name, tools]) => ({
        name,
        type: 'builtin',
        tools: tools.map(tool => ({
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

  // Return cleanup function
  return () => {
    ipcMain.removeListener(IPC.EXTENSION.INSTALL_URL, handleExtensionInstall);
    ipcMain.removeHandler(IPC.EXTENSION.MCP.EXECUTE_TOOL);
    ipcMain.removeHandler(IPC.EXTENSION.MCP.LIST_TOOLS);
    ipcMain.removeHandler(IPC.EXTENSION.MCP.REGISTER_EXTENSION);
    ipcMain.removeHandler(IPC.EXTENSION.MCP.LIST_EXTENSIONS);
  };
}
