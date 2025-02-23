import { ipcMain } from 'electron';

export const setupTestHandlers = () => {
    // Basic ping-pong test
    ipcMain.on('app:ping', (event) => {
        event.reply('app:pong', {
            message: 'pong',
            app: 'Goose Desktop'
        });
    });

    return () => {
        ipcMain.removeAllListeners('app:ping');
    };
};