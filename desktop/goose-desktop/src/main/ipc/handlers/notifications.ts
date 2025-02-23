import { ipcMain, Notification } from 'electron';

export const setupNotificationHandlers = () => {
    ipcMain.on('notify', (_, data) => {
        new Notification({
            title: data.title,
            body: data.body
        }).show();
    });

    return () => {
        ipcMain.removeAllListeners('notify');
    };
};