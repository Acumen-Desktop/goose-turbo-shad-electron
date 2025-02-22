import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { setupIpcHandlers } from './ipc/handlers';
import { createMainWindow } from './windows/createMainWindow';

// Handle uncaught errors at the top level
process.on('uncaughtException', (err) => {
	console.error('Line 8 - main.ts - CRITICAL ERROR:', err);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error('Line 14 - main.ts - Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

let mainWindow: BrowserWindow | null = null;

const initializeApp = async (): Promise<void> => {
	console.log('Line 24 - main.ts - Initializing app');
	try {
		mainWindow = await createMainWindow();
		console.log('Line 27 - main.ts - Main window created successfully');

		setupIpcHandlers(mainWindow);
		console.log('Line 30 - main.ts - IPC handlers set up');

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

		// Listen for window content load
		mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
			console.error('Line 47 - main.ts - Failed to load window content:', {
				errorCode,
				errorDescription
			});
		});

		mainWindow.webContents.on('did-finish-load', () => {
			console.log('Line 53 - main.ts - Window content loaded successfully');
		});
	} catch (err) {
		console.error('Line 57 - main.ts - Failed to initialize app:', err);
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
