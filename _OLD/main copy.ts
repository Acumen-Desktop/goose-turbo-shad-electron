import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { registerIpcHandlers, removeIpcHandlers } from '../ipc_OLD/handlers';
import { createMainWindow } from './createWindows/createMainWindow';

// Handle uncaught errors at the top level
process.on('uncaughtException', (err) => {
	console.error('CRITICAL ERROR:', err);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

let mainWindow: BrowserWindow | null = null;

const initializeApp = async (): Promise<void> => {
	try {
		mainWindow = await createMainWindow();

		// Listen for window content load
		mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
			console.error('Failed to load window content:', {
				errorCode,
				errorDescription
			});
		});

		mainWindow.webContents.on('did-finish-load', () => {
			console.log('Line 53 - main.ts - Window content loaded successfully');
			// Register IPC handlers after window is loaded
			registerIpcHandlers();
			// Send ready event to renderer
			mainWindow?.webContents.send('app:ready');
		});

		mainWindow.on('close', (e) => {
			// TODO: Add confirmation dialog back in
			// const choice = require('electron').dialog.showMessageBoxSync(mainWindow, {
			// 	type: 'question',
			// 	buttons: ['Yes', 'No'],
			// 	title: 'Confirm',
			// 	message: 'Are you sure you want to quit?'
			// });
			// if (choice === 1) {
			//     e.preventDefault();
			// }
		});
	} catch (err) {
		console.error('Failed to initialize app:', err);
		app.quit();
	}
};

// This method will be called when Electron has finished initialization
app.on('ready', initializeApp);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		initializeApp();
	}
});

// Clean up handlers when quitting
app.on('will-quit', () => {
	removeIpcHandlers();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
