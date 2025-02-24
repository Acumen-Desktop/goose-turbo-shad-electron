import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../types/interfaces';
import { checkGoosed, startGoosed, stopGoosed } from './goosed_OLD';

export const registerIpcHandlers = () => {
  console.log('Registering IPC handlers...');

  // Goosed Management
  ipcMain.handle(IPC_CHANNELS.START_GOOSED, async (_event, workingDir?: string) => {
    console.log('Handling START_GOOSED request');
    try {
      const [port] = await startGoosed(workingDir);
      return { isRunning: true, port };
    } catch (error) {
      console.error('Failed to start goosed:', error);
      return { isRunning: false, error: error.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.STOP_GOOSED, async () => {
    console.log('Handling STOP_GOOSED request');
    try {
      await stopGoosed();
      return { isRunning: false };
    } catch (error) {
      console.error('Failed to stop goosed:', error);
      return { isRunning: true, error: error.message };
    }
  });

  ipcMain.handle(IPC_CHANNELS.CHECK_GOOSED, () => {
    console.log('Handling CHECK_GOOSED request');
    const status = checkGoosed();
    return {
      isRunning: status.isRunning,
      port: status.port
    };
  });

  console.log('IPC handlers registered successfully');
};

export const removeIpcHandlers = () => {
  console.log('Removing IPC handlers...');
  ipcMain.removeHandler(IPC_CHANNELS.START_GOOSED);
  ipcMain.removeHandler(IPC_CHANNELS.STOP_GOOSED);
  ipcMain.removeHandler(IPC_CHANNELS.CHECK_GOOSED);
};
