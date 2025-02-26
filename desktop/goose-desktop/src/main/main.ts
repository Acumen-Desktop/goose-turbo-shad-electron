import { app, BrowserWindow } from 'electron';
// import * as squirrelStartup from 'electron-squirrel-startup';
// import started from 'electron-squirrel-startup';
import { initializeBuiltinExtensions } from '../extensions/builtins';
import log from '../utils/logger';
import { createMainWindow } from './main_createWindows/createMainWindow';
import { ipcMainCode } from './main_ipc/index';
import { setupPingHandler } from './main_ipc/tests/ping.handler';

// import { setupAppHandlers, setupErrorHandlers } from './utils_setup';
// import { setupIpcHandlers } from './ipc_OLD/setup';

let mainWindow: BrowserWindow | null = null;

// Set up Goose protocol handler
app.setAsDefaultProtocolClient('goose');

// Triggered when the user opens "goose://..." links
app.on('open-url', async (event, url) => {
	event.preventDefault();
	log.info(`Received protocol URL: ${url}`);

	// Get existing window or create new one
	if (!mainWindow) {
		// Wait for app to be ready before creating a window
		if (!app.isReady()) {
			app.once('ready', async () => {
				mainWindow = await createMainWindow();
				sendExtensionUrl(mainWindow, url);
			});
			return;
		}

		mainWindow = await createMainWindow();
	}

	sendExtensionUrl(mainWindow, url);
});

// Helper function to send extension URL to renderer
function sendExtensionUrl(targetWindow: BrowserWindow, url: string) {
	// Wait for window to be ready before sending the extension URL
	if (!targetWindow.webContents.isLoading()) {
		targetWindow.webContents.send('add-extension', url);
	} else {
		targetWindow.webContents.once('did-finish-load', () => {
			targetWindow.webContents.send('add-extension', url);
		});
	}
}

const initializeApp = async (): Promise<void> => {
	try {
		mainWindow = await createMainWindow();

		// Register all IPC functionality
		const cleanupExtensionListeners = ipcMainCode.listeners.extension();
		const cleanupBrowserHandlers = ipcMainCode.handlers.browser();
		const cleanupFileSystemHandlers = ipcMainCode.handlers.fileSystem();
		const cleanupSystemHandlers = ipcMainCode.handlers.system(app);
		const cleanupPingHandler = setupPingHandler(app);

		// Initialize builtin extensions
		await initializeBuiltinExtensions();

		// Handle window closure
		mainWindow.on('closed', () => {
			log.info('Main window closing - cleaning up...');
			if (cleanupFileSystemHandlers) cleanupFileSystemHandlers();
			if (cleanupSystemHandlers) cleanupSystemHandlers();
			if (cleanupPingHandler) cleanupPingHandler();
			if (cleanupBrowserHandlers) cleanupBrowserHandlers();
			if (cleanupExtensionListeners) cleanupExtensionListeners();
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
	// If app is being installed by Squirrel, quit immediately
	// TODO This keeps getting messed up by typescript or linter fixes.
	// if (started) {
	// 	app.quit();
	// 	return;
	// }

	// setupErrorHandlers();
	// setupAppHandlers();
	app.whenReady().then(initializeApp);
};

startApp();
