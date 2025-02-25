import { dialog, ipcMain } from 'electron';
import { IPC } from '../ipc-channels';
import log from '../../../utils/logger';

type FileSystemResult = string | null;
type CleanupFunction = () => void;

export function registerFileSystemHandlers(): CleanupFunction {
  // Handler for selecting either files or directories
  const selectHandler = ipcMain.handle(
    IPC.FILE_SYSTEM.SELECT,
    async (): Promise<FileSystemResult> => {
      try {
        const result = await dialog.showOpenDialog({
          properties: ['openFile', 'openDirectory'],
          title: 'Select File or Directory',
        });

        if (!result.canceled && result.filePaths.length > 0) {
          log.info('File/Directory selected:', result.filePaths[0]);
          return result.filePaths[0];
        }
        log.info('File/Directory selection cancelled');
        return null;
      } catch (error) {
        log.error('Error in file/directory selection:', error);
        throw error; // Let the renderer handle the error
      }
    }
  );

  // Handler for selecting directories only
  const directoryHandler = ipcMain.handle(
    IPC.FILE_SYSTEM.CHOOSE_DIRECTORY,
    async (): Promise<FileSystemResult> => {
      try {
        const result = await dialog.showOpenDialog({
          properties: ['openDirectory'],
          title: 'Select Directory',
        });

        if (!result.canceled && result.filePaths.length > 0) {
          log.info('Directory selected:', result.filePaths[0]);
          return result.filePaths[0];
        }
        log.info('Directory selection cancelled');
        return null;
      } catch (error) {
        log.error('Error in directory selection:', error);
        throw error; // Let the renderer handle the error
      }
    }
  );

  // Return cleanup function to remove handlers
  return () => {
    log.info('Cleaning up file system handlers');
    ipcMain.removeHandler(IPC.FILE_SYSTEM.SELECT);
    ipcMain.removeHandler(IPC.FILE_SYSTEM.CHOOSE_DIRECTORY);
  };
}
