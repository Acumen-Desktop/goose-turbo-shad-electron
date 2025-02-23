import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { createMainWindow } from './windows/createMainWindow';
import { setupAppHandlers, setupErrorHandlers, setupWindowHandlers } from './utils_setup';

let mainWindow: BrowserWindow | null = null;

const initializeApp = async (): Promise<void> => {
	try {
		mainWindow = await createMainWindow();
		const cleanupWindowHandlers = setupWindowHandlers(mainWindow);
		
		mainWindow.on('close', () => {
			cleanupWindowHandlers();
			// TODO: Add confirmation dialog
		});
		
	} catch (err) {
		console.error('Failed to initialize app:', err);
		app.quit();
	}
};

const startApp = () => {
	if (started) {
		app.quit();
		return;
	}

	setupErrorHandlers();
	setupAppHandlers();
	app.whenReady().then(initializeApp);
};

startApp();
