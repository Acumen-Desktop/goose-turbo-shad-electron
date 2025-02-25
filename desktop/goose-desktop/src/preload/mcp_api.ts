import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '../main/main_ipc/ipc-channels';
import type {
  McpToolExecuteParams,
  McpToolListParams,
  McpExtensionRegisterParams
} from '../main/main_ipc/types/extension.types';

// MCP API exposed to renderer
export const mcpApi = {
  // List all extensions
  listExtensions: () => ipcRenderer.invoke(IPC.EXTENSION.MCP.LIST_EXTENSIONS),

  // List tools (optionally filtered by extension)
  listTools: (params?: McpToolListParams) => 
    ipcRenderer.invoke(IPC.EXTENSION.MCP.LIST_TOOLS, params),

  // Register a new extension
  registerExtension: (params: McpExtensionRegisterParams) =>
    ipcRenderer.invoke(IPC.EXTENSION.MCP.REGISTER_EXTENSION, params),

  // Execute a tool
  executeTool: (params: McpToolExecuteParams) =>
    ipcRenderer.invoke(IPC.EXTENSION.MCP.EXECUTE_TOOL, params)
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('mcpApi', mcpApi);

// Type definition for the exposed API
declare global {
  interface Window {
    mcpApi: typeof mcpApi;
  }
}