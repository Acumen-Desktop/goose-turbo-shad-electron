// tests/main-handle-requests/ping.handler.ts
import { ipcMain } from 'electron';
import { IPC } from '../ipc-channels';

export function setupPingHandler(app: Electron.App) {
    ipcMain.handle(IPC.TEST.PING, (event) => {
        // console.log('Line 7 - ping.handler.ts - event: ', event);
        return {
            message: 'pong',
            timestamp: new Date().toISOString()
        };
    });
    return () => {
        ipcMain.removeHandler(IPC.TEST.PING);
    };
}