import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { createMainWindow } from './windows/createMainWindow';
import { setupAppHandlers, setupErrorHandlers } from './utils_setup';
// import { setupIpcHandlers } from './ipc_OLD/setup';

let mainWindow: BrowserWindow | null = null;

const initializeApp = async (): Promise<void> => {
	try {
		mainWindow = await createMainWindow();
		// const cleanupIpc = setupIpcHandlers(mainWindow);

		// mainWindow.on('close', () => {
		// 	cleanupIpc();
		// });

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

	// setupErrorHandlers();
	// setupAppHandlers();
	app.whenReady().then(initializeApp);
};

startApp();
