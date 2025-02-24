import { BrowserWindow, ipcMain } from 'electron';
import { IPC_CHANNELS, PongResponse } from '../types/interfaces';

export function setupIpcHandlers(mainWindow: BrowserWindow): void {
	// Basic IPC setup for testing
	ipcMain.on('app:ping', handlePing);

	// Add more handlers here as needed
}

/**
 * Handles ping request from renderer
 */
export const handlePing = (event: Electron.IpcMainEvent): void => {
	const response: PongResponse = {
		message: 'Pong from main!',
		app: process.env.SELECTED_APP || 'unknown'
	};
	event.reply(IPC_CHANNELS.PONG, response);
};
