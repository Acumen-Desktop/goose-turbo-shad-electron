import { BrowserWindow, ipcMain } from 'electron';
import { setupTestHandlers } from './handlers/test';
import { setupGoosedHandlers } from './handlers/goosed';
import { setupFileHandlers } from './handlers/files';
import { setupNotificationHandlers } from './handlers/notifications';

export const setupIpcHandlers = (mainWindow: BrowserWindow) => {
    const cleanupTest = setupTestHandlers();
    const cleanupGoosed = setupGoosedHandlers();
    const cleanupFiles = setupFileHandlers();
    const cleanupNotifications = setupNotificationHandlers();

    return () => {
        cleanupTest();
        cleanupGoosed();
        cleanupFiles();
        cleanupNotifications();
    };
};