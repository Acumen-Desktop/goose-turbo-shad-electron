import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from './main_ipc/ipc-channels';
import type {
	McpExtensionRegisterParams,
	McpToolExecuteParams,
	McpToolListParams
} from './main_ipc/types/extension.types';
import type {
	ChatWindowOptions,
	GoosedCheckResponse,
	GoosedStartResponse,
	GoosedStopResponse,
	NotificationData
} from './main_ipc/types/index';
import type { AppConfigAPI, ElectronAPI, TestAPI } from './types/electron/electron-api';

// Parse config from process arguments
const config = JSON.parse(process.argv.find((arg) => arg.startsWith('{')) || '{}');

const electronAPI: ElectronAPI = {
	// Config
	getConfig: () => config,

	// Window management
	hideWindow: () => ipcRenderer.send(IPC.WINDOW.HIDE),
	createChatWindow: (query?: string, dir?: string, version?: string) =>
		ipcRenderer.send(IPC.WINDOW.CREATE_CHAT, { query, dir, version } as ChatWindowOptions),

	// File system
	selectFileOrDirectory: () => ipcRenderer.invoke(IPC.FILE_SYSTEM.SELECT) as Promise<string | null>,
	directoryChooser: (replace: string) =>
		ipcRenderer.send(IPC.FILE_SYSTEM.CHOOSE_DIRECTORY, { replace }),

	// System operations
	reloadApp: () => ipcRenderer.send(IPC.SYSTEM.RELOAD_APP),
	checkForOllama: () => ipcRenderer.invoke(IPC.SYSTEM.CHECK_OLLAMA) as Promise<boolean>,
	getBinaryPath: (binaryName: string) =>
		ipcRenderer.invoke(IPC.SYSTEM.GET_BINARY_PATH, binaryName) as Promise<string>,
	startPowerSaveBlocker: () => ipcRenderer.invoke(IPC.SYSTEM.POWER_SAVE.START) as Promise<number>,
	stopPowerSaveBlocker: () => ipcRenderer.invoke(IPC.SYSTEM.POWER_SAVE.STOP) as Promise<void>,

	// Goosed operations
	startGoosed: () => ipcRenderer.invoke(IPC.SYSTEM.START_GOOSED) as Promise<GoosedStartResponse>,
	stopGoosed: (port: number) =>
		ipcRenderer.invoke(IPC.SYSTEM.STOP_GOOSED, port) as Promise<GoosedStopResponse>,
	checkGoosed: () => ipcRenderer.invoke(IPC.SYSTEM.CHECK_GOOSED) as Promise<GoosedCheckResponse>,

	// Notifications and logging
	logInfo: (txt: string) => ipcRenderer.send(IPC.NOTIFICATION.LOG_INFO, txt),
	showNotification: (data: NotificationData) => ipcRenderer.send(IPC.NOTIFICATION.SHOW, data),

	// Browser operations
	openInChrome: (url: string) => ipcRenderer.send(IPC.BROWSER.OPEN_CHROME, url),
	fetchMetadata: (url: string) => ipcRenderer.invoke(IPC.BROWSER.FETCH_METADATA, url),

	// Extension operations
	addExtension: (url: string) => {
		// First try handling through main process
		ipcRenderer.send('add-extension', url);
		// Return a Promise to match API
		return Promise.resolve({ success: true });
	},

	// Event handling
	on: (channel, callback) => {
		if (typeof channel === 'string') {
			ipcRenderer.on(channel, callback);
		}
	},
	off: (channel, callback) => {
		if (typeof channel === 'string') {
			ipcRenderer.off(channel, callback);
		}
	},
	emit: (channel, ...args) => {
		if (typeof channel === 'string') {
			ipcRenderer.emit(channel, ...args);
		}
	}
};

const appConfigAPI: AppConfigAPI = {
	get: (key: string) => config[key],
	getAll: () => config
};

const testAPI: TestAPI = {
	sendPing: () =>
		ipcRenderer.invoke(IPC.TEST.PING) as Promise<{ timestamp: string; message: string }>
};

// MCP API for extension functionality
const mcpApi = {
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

// Expose the APIs
contextBridge.exposeInMainWorld('electronApi', electronAPI);
contextBridge.exposeInMainWorld('appConfigApi', appConfigAPI);
contextBridge.exposeInMainWorld('testApi', testAPI);
contextBridge.exposeInMainWorld('mcpApi', mcpApi);

// Type declarations
declare global {
	interface Window {
		electronApi: ElectronAPI;
		appConfigApi: AppConfigAPI;
		testApi: TestAPI;
		mcpApi: typeof mcpApi;
	}
}
