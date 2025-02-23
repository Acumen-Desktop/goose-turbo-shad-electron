import { ipcMain } from 'electron';
import { spawn } from 'child_process';
import { IPC } from '../../shared/ipc-channels';
import log from '../../../utils/logger';

export function registerBrowserListeners(): void {
  ipcMain.on(IPC.BROWSER.OPEN_CHROME, (_, url: string) => {
    try {
      if (process.platform === 'darwin') {
        spawn('open', ['-a', 'Google Chrome', url]);
      } else if (process.platform === 'win32') {
        spawn('cmd.exe', ['/c', 'start', '', 'chrome', url]);
      } else {
        spawn('xdg-open', [url]);
      }
    } catch (error) {
      log.error('Error opening Chrome:', error);
    }
  });
}
