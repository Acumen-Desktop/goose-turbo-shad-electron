// tests/main-handle-requests/ping.handler.ts
import { ipcMain } from 'electron';
import { IPC } from '../../shared/ipc-channels';

export function setupPingHandler() {
    ipcMain.handle(IPC.TEST.PING, async () => {
        return {
            message: 'pong',
            timestamp: new Date().toISOString()
        };
    });

    return () => {
        ipcMain.removeHandler(IPC.TEST.PING);
    };
}