import { ipcMain, dialog } from 'electron';

export const setupFileHandlers = () => {
    ipcMain.handle('select-file-or-directory', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        });
        
        if (!result.canceled && result.filePaths.length > 0) {
            return result.filePaths[0];
        }
        return null;
    });

    return () => {
        ipcMain.removeHandler('select-file-or-directory');
    };
};