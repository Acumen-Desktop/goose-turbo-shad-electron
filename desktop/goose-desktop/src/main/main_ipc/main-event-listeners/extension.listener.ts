import { ipcMain, BrowserWindow } from 'electron';
import { IPC } from '../ipc-channels';
import log from '../../../utils/logger';

export function registerExtensionListeners(): void {
  ipcMain.once(IPC.EXTENSION.INSTALL_URL, (event, url: string) => {
    // todo Check this
    // win.close();
    console.log('Line 9 - extension.listener.ts, thi was in the original file');
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
    //original code
    // app.emit('open-url', mockEvent, url);
  });
}
