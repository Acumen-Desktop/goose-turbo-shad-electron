import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { createMainWindow } from './main_createWindows/createMainWindow';
import { ipcMainCode } from './main_ipc/index';
import { setupPingHandler } from './main_ipc/tests/ping.handler';
import log from '../utils/logger';
// import { setupAppHandlers, setupErrorHandlers } from './utils_setup';
// import { setupIpcHandlers } from './ipc_OLD/setup';

let mainWindow: BrowserWindow | null = null;

const initializeApp = async (): Promise<void> => {
	try {
		mainWindow = await createMainWindow();
		
		// Register all IPC functionality
				ipcMainCode.listeners.browser(mainWindow);
		ipcMainCode.listeners.extension();
		
		const cleanupBrowserHandlers = ipcMainCode.handlers.browser(mainWindow);
		const cleanupFileSystemHandlers = ipcMainCode.handlers.fileSystem();
		const cleanupSystemHandlers = ipcMainCode.handlers.system(app);
		const cleanupPingHandler = setupPingHandler(app);
		
		// Handle window closure
		mainWindow.on('closed', () => {
			log.info('Main window closing - cleaning up...');
			if (cleanupFileSystemHandlers) cleanupFileSystemHandlers();
			if (cleanupSystemHandlers) cleanupSystemHandlers();
			if (cleanupPingHandler) cleanupPingHandler();
			mainWindow = null;
		});

		// Handle application quit
		app.on('before-quit', () => {
			log.info('Application quitting - performing final cleanup...');
			// Cleanup any remaining handlers
			if (cleanupSystemHandlers) cleanupSystemHandlers();
			if (cleanupPingHandler) cleanupPingHandler();
			
			// Disable all logging transports
			log.transports.file.level = false;
			log.transports.console.level = false;
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

	// setupErrorHandlers();
	// setupAppHandlers();
	app.whenReady().then(initializeApp);
};

startApp();
