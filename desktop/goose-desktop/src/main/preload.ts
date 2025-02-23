import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../ipc/types/interfaces';

// Parse config from process arguments
const config = JSON.parse(process.argv.find((arg) => arg.startsWith('{')) || '{}');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
	// Configuration
	getConfig: () => config,

	// Window Management
	hideWindow: () => ipcRenderer.send(IPC_CHANNELS.HIDE_WINDOW),
	createChatWindow: (query?: string, dir?: string, version?: string) =>
		ipcRenderer.send(IPC_CHANNELS.CREATE_CHAT_WINDOW, query, dir, version),
	createWingToWingWindow: (query: string) =>
		ipcRenderer.send(IPC_CHANNELS.CREATE_WING_TO_WING_WINDOW, query),

	// File System Operations
	directoryChooser: (replace: boolean) => ipcRenderer.send(IPC_CHANNELS.DIRECTORY_CHOOSER, replace),
	selectFileOrDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.SELECT_FILE_OR_DIRECTORY),

	// System Integration
	openInChrome: (url: string) => ipcRenderer.send(IPC_CHANNELS.OPEN_IN_CHROME, url),
	fetchMetadata: (url: string) => ipcRenderer.invoke(IPC_CHANNELS.FETCH_METADATA, url),
	reloadApp: () => ipcRenderer.send(IPC_CHANNELS.RELOAD_APP),
	getBinaryPath: (binaryName: string) =>
		ipcRenderer.invoke(IPC_CHANNELS.GET_BINARY_PATH, binaryName),

	// Notifications & Logging
	logInfo: (txt: string) => ipcRenderer.send(IPC_CHANNELS.LOG_INFO, txt),
	showNotification: (data: { title: string; body: string }) =>
		ipcRenderer.send(IPC_CHANNELS.NOTIFY, data),

	// Power Management
	startPowerSaveBlocker: () => ipcRenderer.invoke(IPC_CHANNELS.START_POWER_SAVE_BLOCKER),
	stopPowerSaveBlocker: () => ipcRenderer.invoke(IPC_CHANNELS.STOP_POWER_SAVE_BLOCKER),

	// Ollama Integration
	checkForOllama: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_OLLAMA),

	// Event Management
	on: (channel: string, callback: (...args: any[]) => void) => ipcRenderer.on(channel, callback),
	off: (channel: string, callback: (...args: any[]) => void) => ipcRenderer.off(channel, callback),
	send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),

	// Test Ping Pong
	ping: () => ipcRenderer.send(IPC_CHANNELS.PING),
	onPong: (callback: (data: any) => void) => {
		const listener = (_event: Electron.IpcRendererEvent, data: any) => callback(data);
		ipcRenderer.on(IPC_CHANNELS.PONG, listener);
		return () => ipcRenderer.removeListener(IPC_CHANNELS.PONG, listener);
	},

	// Goosed Management
	startGoosed: (workingDir?: string) => ipcRenderer.invoke(IPC_CHANNELS.START_GOOSED, workingDir),
	stopGoosed: () => ipcRenderer.invoke(IPC_CHANNELS.STOP_GOOSED),
	checkGoosed: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_GOOSED)
});

// Also expose the config directly like in the original Goose implementation
contextBridge.exposeInMainWorld('appConfig', {
	get: (key: string) => config[key],
	getAll: () => config
});
