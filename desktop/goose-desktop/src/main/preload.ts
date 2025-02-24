import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from './main_ipc/ipc-channels';
import type { ElectronAPI, AppConfigAPI, TestAPI } from '../types/electron-api';

const config = JSON.parse(process.argv.find((arg) => arg.startsWith('{')) || '{}');

const electronAPI: ElectronAPI = {
  getConfig: () => config,
  hideWindow: () => ipcRenderer.send('hide-window'),
  createChatWindow: (query?: string, dir?: string, version?: string) =>
    ipcRenderer.send('create-chat-window', query, dir, version),
  logInfo: (txt: string) => ipcRenderer.send('logInfo', txt),
  showNotification: (data: any) => ipcRenderer.send('notify', data),
  openInChrome: (url: string) => ipcRenderer.send('open-in-chrome', url),
  fetchMetadata: (url: string) => ipcRenderer.invoke('fetch-metadata', url),
  reloadApp: () => ipcRenderer.send('reload-app'),
  checkForOllama: () => ipcRenderer.invoke('check-ollama'),
  selectFileOrDirectory: () => ipcRenderer.invoke(IPC.FILE_SYSTEM.SELECT),
  directoryChooser: () => ipcRenderer.invoke(IPC.FILE_SYSTEM.CHOOSE_DIRECTORY),
  startPowerSaveBlocker: () => ipcRenderer.invoke('start-power-save-blocker'),
  stopPowerSaveBlocker: () => ipcRenderer.invoke('stop-power-save-blocker'),
  startGoosed: () => ipcRenderer.invoke(IPC.SYSTEM.START_GOOSED),
  stopGoosed: (port: number) => ipcRenderer.invoke(IPC.SYSTEM.STOP_GOOSED, port),
  checkGoosed: () => ipcRenderer.invoke(IPC.SYSTEM.CHECK_GOOSED),
  getBinaryPath: (binaryName: string) => ipcRenderer.invoke('get-binary-path', binaryName),
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  off: (channel, callback) => {
    ipcRenderer.off(channel, callback);
  },
  emit: (channel, ...args) => {
    ipcRenderer.emit(channel, ...args);
  },
};

const appConfigAPI: AppConfigAPI = {
  get: (key: string) => config[key],
  getAll: () => config,
};

const testAPI: TestAPI = {
  sendPing: () => ipcRenderer.invoke(IPC.TEST.PING),
}

// Expose the APIs
contextBridge.exposeInMainWorld('electronApi', electronAPI);
contextBridge.exposeInMainWorld('appConfigApi', appConfigAPI);
contextBridge.exposeInMainWorld('testApi', testAPI);
