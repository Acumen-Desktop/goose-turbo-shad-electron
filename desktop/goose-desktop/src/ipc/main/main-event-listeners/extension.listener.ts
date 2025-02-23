import { ipcMain, BrowserWindow } from 'electron';
import { IPC } from '../../shared/ipc-channels';
import log from '../../../utils/logger';

export function registerExtensionListeners(): void {
  ipcMain.on(IPC.EXTENSION.INSTALL_URL, (event, url: string) => {
    if (!url?.trim()) {
      log.warn('Empty extension URL received');
      return;
    }

    const mockEvent = {
      preventDefault: () => {
        log.info('Default handling prevented for extension URL');
      },
    };

    // Re-emit as an open-url event which is handled by the app
    event.sender.send('open-url', mockEvent, url);
  });
}
