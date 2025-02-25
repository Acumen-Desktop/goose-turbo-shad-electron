import { BrowserWindow } from 'electron';
import { IPC } from '../ipc-channels';
import log from '../../../utils/logger';

export function sendFatalError(error: Error): void {
  const windows = BrowserWindow.getAllWindows();
  const message = error.message || 'An unexpected error occurred';
  
  windows.forEach((win) => {
    try {
      win.webContents.send(IPC.NOTIFICATION.FATAL_ERROR, message);
    } catch (err) {
      log.error('Error sending fatal error to window:', err);
    }
  });
}

export function sendExtensionUrl(window: BrowserWindow, url: string): void {
  try {
    if (!window.webContents.isLoading()) {
      window.webContents.send(IPC.EXTENSION.ADD, url);
    } else {
      window.webContents.once('did-finish-load', () => {
        window.webContents.send(IPC.EXTENSION.ADD, url);
      });
    }
  } catch (error) {
    log.error('Error sending extension URL:', error);
  }
}
