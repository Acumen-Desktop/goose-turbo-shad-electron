import { BrowserWindow, ipcMain } from 'electron';

export function setupIpcHandlers(mainWindow: BrowserWindow): void {
	// Basic IPC setup for testing
	ipcMain.on('app:ping', (event) => {
		console.log('Line 6 - handlers/index.ts - Received ping from renderer');
		event.reply('app:pong', {
			message: 'Pong from main!',
			app: process.env.SELECTED_APP || 'unknown'
		});
	});

	// Add more handlers here as needed
}
