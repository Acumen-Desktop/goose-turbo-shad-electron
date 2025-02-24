import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { createMainWindow } from './main_createWindows/createMainWindow';
import { ipcMainCode } from './main_ipc/index';
import {setupPingHandler} from './main_ipc/tests/ping.handler';
// import { setupAppHandlers, setupErrorHandlers } from './utils_setup';
// import { setupIpcHandlers } from './ipc_OLD/setup';

let mainWindow: BrowserWindow | null = null;

const initializeApp = async (): Promise<void> => {
	try {
		mainWindow = await createMainWindow();
		
		// Register all IPC functionality
  		ipcMainCode.listeners.browser(mainWindow);
		ipcMainCode.listeners.extension();
		ipcMainCode.handlers.browser();
		ipcMainCode.handlers.fileSystem();
		ipcMainCode.handlers.system();
		setupPingHandler();

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
