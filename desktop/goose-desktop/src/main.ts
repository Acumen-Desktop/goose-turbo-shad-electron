import path from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';

// Handle uncaught errors at the top level
process.on('uncaughtException', (err) => {
	console.error('CRITICAL ERROR:', err);
	process.exit(1);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

const createWindow = async (): Promise<void> => {
	const mainWindow = new BrowserWindow({
		x: 2048,
		y: 0,
		width: 1800,
		height: 1000,
		backgroundColor: '#000',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	// Load the app URL from environment variable
	const appUrl = process.env.ELECTRON_APP_URL;

	try {
		if (appUrl) {
			await mainWindow.loadURL(appUrl);
		} else if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
			await mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		} else if (MAIN_WINDOW_VITE_NAME) {
			const indexPath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
			await mainWindow.loadFile(indexPath);
		} else {
			throw new Error('No valid app URL or build found');
		}
	} catch (err) {
		// Get error page path, with fallback if app is not ready
		let errorPath: string;
		try {
			errorPath = path.join(app.getAppPath(), 'static/error.html');
		} catch (appError) {
			// Fallback to a relative path if app is not ready
			console.error('Line 50 - main.ts - Failed to get app path:', appError);
			errorPath = path.join(__dirname, '../../static/error.html');
		}

		const params = new URLSearchParams({
			message: err.message || 'Unknown error',
			type: err.name || 'Error',
			stack: err.stack || '',
			appUrl: appUrl || '',
			devServer: MAIN_WINDOW_VITE_DEV_SERVER_URL || '',
			nodeEnv: process.env.NODE_ENV || ''
		});

		try {
			const errorUrl = `file://${errorPath}?${params.toString()}`;
			console.log(`Line 62 - main.ts - Loading error page from: ${errorUrl}`);
			await mainWindow.loadURL(errorUrl);
		} catch (errorPageError) {
			// If error page fails, try loading it without parameters
			console.error(
				'Line 56 - main.ts - Failed to load error page with parameters:',
				errorPageError
			);
			try {
				await mainWindow.loadFile(errorPath);
			} catch (plainErrorPageError) {
				// If both attempts fail, show inline error
				console.error('Line 66 - main.ts - Failed to load plain error page:', plainErrorPageError);
				const inlineHtml = encodeURIComponent(
					`
					<html><head><title>Critical Error</title><meta charset="utf-8"></head>
					<body style="background: #1a1a1a; color: #fff; font-family: sans-serif; padding: 2em; text-align: center;">
						<h1 style="color: #ff4444;">Critical Error</h1>
						<p>Failed to load both the application and the error page.</p>
						<div style="text-align: left; margin: 20px auto; max-width: 800px;">
							<h3 style="color: #888;">Application Error:</h3>
							<pre style="background: #333; padding: 1em; margin: 1em; white-space: pre-wrap; word-break: break-word;">${err.message}\n\n${err.stack || ''}</pre>
							<h3 style="color: #888;">Error Page Error:</h3>
							<pre style="background: #333; padding: 1em; margin: 1em; white-space: pre-wrap; word-break: break-word;">${errorPageError.message}</pre>
						</div>
					</body></html>
				`
						.trim()
						.replace(/\s+/g, ' ')
				);

				await mainWindow.webContents.loadURL(`data:text/html;charset=utf-8,${inlineHtml}`);
			}
		}
	}

	// Basic IPC setup
	ipcMain.on('app:ping', (event) => {
		console.log('Line 34 - main.ts - Received ping from renderer');
		event.reply('app:pong', {
			message: 'Pong from main!',
			app: process.env.SELECTED_APP || 'unknown'
		});
	});

	// Handle window close
	mainWindow.on('close', (e) => {
		// TODO add this back in
		// const choice = require('electron').dialog.showMessageBoxSync(mainWindow, {
		// 	type: 'question',
		// 	buttons: ['Yes', 'No'],
		// 	title: 'Confirm',
		// 	message: 'Are you sure you want to quit?'
		// });
		// if (choice === 1) {
		// 	e.preventDefault();
		// }
	});

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
