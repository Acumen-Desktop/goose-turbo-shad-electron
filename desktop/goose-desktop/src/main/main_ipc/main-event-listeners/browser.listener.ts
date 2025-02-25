import { ipcMain, BrowserWindow, IpcMainEvent } from 'electron';
import { spawn } from 'child_process';
import { IPC } from '../ipc-channels';
import { IPCMainListener } from '../types';
import log from '../../../utils/logger';

function isValidUrl(urlString: string): boolean {
  try {
    // Add protocol if missing
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
}

function openInChrome(url: string): void {
  try {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL format');
    }

    if (process.platform === 'darwin') {
      spawn('open', ['-a', 'Google Chrome', url]);
    } else if (process.platform === 'win32') {
      spawn('cmd.exe', ['/c', 'start', '', 'chrome', url]);
    } else {
      spawn('xdg-open', [url]);
    }
  } catch (error) {
    log.error('Error opening Chrome:', error);
    throw error;
  }
}

const handleOpenInChrome: IPCMainListener<string> = (event: IpcMainEvent, url: string) => {
  try {
    openInChrome(url);
  } catch (error) {
    log.error('Error in openInChrome handler:', error);
  }
};

export function registerBrowserListeners(mainWindow?: BrowserWindow): () => void {
  // Register listeners
  ipcMain.on(IPC.BROWSER.OPEN_CHROME, handleOpenInChrome);

  // Return cleanup function
  return () => {
    ipcMain.removeListener(IPC.BROWSER.OPEN_CHROME, handleOpenInChrome);
  };
}
