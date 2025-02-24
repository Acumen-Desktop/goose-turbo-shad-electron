import { ipcRenderer } from 'electron';
import { IPC } from '../../ipc-channels';
import { ChatWindowOptions, NotificationData } from '../../types';

export function hideWindow(): void {
  ipcRenderer.send(IPC.WINDOW.HIDE);
}

export function createChatWindow(options: ChatWindowOptions = {}): void {
  ipcRenderer.send(IPC.WINDOW.CREATE_CHAT, options);
}

export function chooseDirectory(replace: boolean = false): void {
  ipcRenderer.send(IPC.FILE_SYSTEM.CHOOSE_DIRECTORY, replace);
}

export function showNotification(data: NotificationData): void {
  ipcRenderer.send(IPC.NOTIFICATION.SHOW, data);
}

export function logInfo(text: string): void {
  ipcRenderer.send(IPC.NOTIFICATION.LOG_INFO, text);
}

export function reloadApp(): void {
  ipcRenderer.send(IPC.SYSTEM.RELOAD_APP);
}

export function openInChrome(url: string): void {
  ipcRenderer.send(IPC.BROWSER.OPEN_CHROME, url);
}

export function installExtension(url: string): void {
  ipcRenderer.send(IPC.EXTENSION.INSTALL_URL, url);
}
