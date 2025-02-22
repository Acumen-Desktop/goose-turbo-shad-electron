import path from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

const createWindow = (): void => {
	// Create the browser window.
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

	if (appUrl) {
		// Ensure we're using the correct URL by logging it
		console.log(`Line 26 - main.ts - Loading app from URL: ${appUrl}`);
		mainWindow.loadURL(appUrl).catch((err) => {
			console.error(`Failed to load URL ${appUrl}:`, err);
			// If loading fails, show the error page
			mainWindow.loadFile(path.join(__dirname, '../error.html'));
		});
	} else {
		// Fallback to a local error page
		mainWindow.loadFile(path.join(__dirname, '../error.html'));
		console.error('No ELECTRON_APP_URL provided');
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
		const choice = require('electron').dialog.showMessageBoxSync(mainWindow, {
			type: 'question',
			buttons: ['Yes', 'No'],
			title: 'Confirm',
			message: 'Are you sure you want to quit?'
		});

		if (choice === 1) {
			e.preventDefault();
		}
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
