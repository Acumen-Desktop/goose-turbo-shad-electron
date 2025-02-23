import { dialog, ipcMain } from 'electron';
import { IPC } from '../../shared/ipc-channels';
import log from '../../../utils/logger';

export function registerFileSystemHandlers(): void {
  ipcMain.handle(IPC.FILE_SYSTEM.SELECT, async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory'],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
      }
      return null;
    } catch (error) {
      log.error('Error in file selection:', error);
      return null;
    }
  });
}
