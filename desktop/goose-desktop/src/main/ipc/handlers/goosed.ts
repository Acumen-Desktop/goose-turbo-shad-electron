import { ipcMain } from 'electron';
import { startGoosed, stopGoosed, checkGoosed } from '../../services/goosed';
import { IPC_CHANNELS } from '../../../ipc/types/interfaces';

export const setupGoosedHandlers = () => {
    ipcMain.handle(IPC_CHANNELS.START_GOOSED, async () => {
        try {
            const [port, workingDir, process] = await startGoosed();
            return { success: true, port, workingDir };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle(IPC_CHANNELS.STOP_GOOSED, async () => {
        try {
            await stopGoosed();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle(IPC_CHANNELS.CHECK_GOOSED, async () => {
        try {
            return await checkGoosed();
        } catch (error) {
            return { isRunning: false, error: error.message };
        }
    });

    return () => {
        ipcMain.removeHandler(IPC_CHANNELS.START_GOOSED);
        ipcMain.removeHandler(IPC_CHANNELS.STOP_GOOSED);
        ipcMain.removeHandler(IPC_CHANNELS.CHECK_GOOSED);
    };
};
