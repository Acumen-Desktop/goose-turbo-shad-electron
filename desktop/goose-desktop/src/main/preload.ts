import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from './main_ipc/ipc-channels';
import type { ElectronAPI, AppConfigAPI, TestAPI } from '../types/electron-api';
import type { NotificationData, ChatWindowOptions, GoosedStatus } from './main_ipc/types';

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
  selectFileOrDirectory: () => 
    ipcRenderer.invoke(IPC.FILE_SYSTEM.SELECT) as Promise<string | null>,
  directoryChooser: (replace: string) => 
    ipcRenderer.send(IPC.FILE_SYSTEM.CHOOSE_DIRECTORY, { replace }),

  // System operations
  reloadApp: () => ipcRenderer.send(IPC.SYSTEM.RELOAD_APP),
  checkForOllama: () => 
    ipcRenderer.invoke(IPC.SYSTEM.CHECK_OLLAMA) as Promise<boolean>,
  getBinaryPath: (binaryName: string) => 
    ipcRenderer.invoke(IPC.SYSTEM.GET_BINARY_PATH, binaryName) as Promise<string>,
  startPowerSaveBlocker: () => 
    ipcRenderer.invoke(IPC.SYSTEM.POWER_SAVE.START) as Promise<number>,
  stopPowerSaveBlocker: () => 
    ipcRenderer.invoke(IPC.SYSTEM.POWER_SAVE.STOP) as Promise<void>,

  // Goosed operations
  startGoosed: () => 
    ipcRenderer.invoke(IPC.SYSTEM.START_GOOSED) as Promise<{ port?: number; error?: string }>,
  stopGoosed: (port: number) => 
    ipcRenderer.invoke(IPC.SYSTEM.STOP_GOOSED, port) as Promise<{ isRunning: boolean; error?: string }>,
  checkGoosed: () => 
    ipcRenderer.invoke(IPC.SYSTEM.CHECK_GOOSED) as Promise<{ isRunning: boolean; port?: number }>,

  // Notifications and logging
  logInfo: (txt: string) => ipcRenderer.send(IPC.NOTIFICATION.LOG_INFO, txt),
  showNotification: (data: NotificationData) => 
    ipcRenderer.send(IPC.NOTIFICATION.SHOW, data),

  // Browser operations
  openInChrome: (url: string) => ipcRenderer.send(IPC.BROWSER.OPEN_CHROME, url),
  fetchMetadata: (url: string) => 
    ipcRenderer.invoke(IPC.BROWSER.FETCH_METADATA, url),

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
  },
};

const appConfigAPI: AppConfigAPI = {
  get: (key: string) => config[key],
  getAll: () => config,
};

const testAPI: TestAPI = {
  sendPing: () => 
    ipcRenderer.invoke(IPC.TEST.PING) as Promise<{ timestamp: string; message: string }>,
};

// Expose the APIs
contextBridge.exposeInMainWorld('electronApi', electronAPI);
contextBridge.exposeInMainWorld('appConfigApi', appConfigAPI);
contextBridge.exposeInMainWorld('testApi', testAPI);

// Type declarations
declare global {
  interface Window {
    electronApi: ElectronAPI;
    appConfigApi: AppConfigAPI;
    testApi: TestAPI;
  }
}
