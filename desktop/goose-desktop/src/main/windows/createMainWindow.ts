import path from 'node:path';
import { BrowserWindow } from 'electron';

// These should be defined by Vite, but let's check if they exist
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string | undefined;

export const createMainWindow = async (): Promise<BrowserWindow> => {
	console.log('Line 9 - createMainWindow.ts - Starting window creation');

	// Get the preload script path
	const preloadPath = path.join(process.cwd(), '.vite/build/preload/preload.js');
	console.log(`Line 13 - createMainWindow.ts - Preload script path: ${preloadPath}`);

	// Create the browser window
	const mainWindow = new BrowserWindow({
		x: 2048,
		y: 0,
		width: 1800,
		height: 1000,
		backgroundColor: '#000',
		webPreferences: {
			nodeIntegration: false, // Security: Disable Node.js integration
			contextIsolation: true, // Security: Enable context isolation
			preload: preloadPath
		}
	});

	// Set up window event logging
	setupWindowLogging(mainWindow);

	// Load the app content
	await loadAppContent(mainWindow);

	// Open the DevTools in development
	if (process.env.NODE_ENV === 'development') {
		mainWindow.webContents.openDevTools();
	}

	return mainWindow;
};

function setupWindowLogging(window: BrowserWindow): void {
	window.webContents.on('did-start-loading', () => {
		console.log('Line 34 - createMainWindow.ts - Window started loading');
	});

	window.webContents.on('did-finish-load', () => {
		console.log('Line 38 - createMainWindow.ts - Window finished loading');
	});

	window.webContents.on('did-fail-load', (_, errorCode, errorDescription, validatedURL) => {
		console.error('Failed to load:', {
			errorCode,
			errorDescription,
			validatedURL
		});
	});

	window.webContents.on('dom-ready', () => {
		console.log('Line 50 - createMainWindow.ts - DOM is ready');
	});
}

async function loadAppContent(window: BrowserWindow): Promise<void> {
	// Add load timeout detection
	const timeout = setTimeout(() => {
		console.error('Window load timed out after 10 seconds');
	}, 10000);

	const appUrl = process.env.ELECTRON_APP_URL;

	// Log environment variables in development only
	if (process.env.NODE_ENV === 'development') {
		console.log('Development environment variables:', {
			appUrl,
			MAIN_WINDOW_VITE_DEV_SERVER_URL,
			MAIN_WINDOW_VITE_NAME,
			NODE_ENV: process.env.NODE_ENV
		});
	}

	try {
		if (appUrl) {
			await window.loadURL(appUrl);
		} else if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
			await loadFromDevServer(window);
		} else if (MAIN_WINDOW_VITE_NAME) {
			await loadFromFile(window);
		} else {
			throw new Error('No valid app URL or build found');
		}
		clearTimeout(timeout);
	} catch (err) {
		clearTimeout(timeout);
		console.error('Error loading window:', err);
		await handleWindowLoadError(window, err, appUrl);
	}
}

async function loadFromDevServer(window: BrowserWindow): Promise<void> {
	try {
		const response = await fetch(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		const html = await response.text();
		if (!html.includes('renderer.ts')) {
			console.error('Dev server response does not contain renderer.ts');
		}
	} catch (err) {
		console.error('Dev server check failed:', err);
	}
	await window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
}

async function loadFromFile(window: BrowserWindow): Promise<void> {
	const basePath = process.env.NODE_ENV === 'development' ? 'src/renderer' : 'dist';
	const indexPath = path.join(process.cwd(), basePath, MAIN_WINDOW_VITE_NAME);
	await window.loadFile(indexPath);
}

async function handleWindowLoadError(
	window: BrowserWindow,
	err: Error,
	appUrl: string | undefined
): Promise<void> {
	// Get error page path, with fallback if app is not ready
	let errorPath: string;
	try {
		const { app } = require('electron');
		errorPath = path.join(app.getAppPath(), 'static/error.html');
	} catch (appError) {
		console.error(`Line 54 - createMainWindow.ts - Failed to get app path:`, appError);
		errorPath = path.join(__dirname, '../../../static/error.html');
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
		console.log(`Line 69 - createMainWindow.ts - Loading error page from: ${errorUrl}`);
		await window.loadURL(errorUrl);
	} catch (errorPageError) {
		console.error(
			`Line 72 - createMainWindow.ts - Failed to load error page with parameters:`,
			errorPageError
		);
		try {
			await window.loadFile(errorPath);
		} catch (plainErrorPageError) {
			console.error(
				`Line 77 - createMainWindow.ts - Failed to load plain error page:`,
				plainErrorPageError
			);
			await loadInlineErrorPage(window, err, errorPageError);
		}
	}
}

async function loadInlineErrorPage(
	window: BrowserWindow,
	originalError: Error,
	errorPageError: Error
): Promise<void> {
	const inlineHtml = encodeURIComponent(
		`
        <html><head><title>Critical Error</title><meta charset="utf-8"></head>
        <body style="background: #1a1a1a; color: #fff; font-family: sans-serif; padding: 2em; text-align: center;">
            <h1 style="color: #ff4444;">Critical Error</h1>
            <p>Failed to load both the application and the error page.</p>
            <div style="text-align: left; margin: 20px auto; max-width: 800px;">
                <h3 style="color: #888;">Application Error:</h3>
                <pre style="background: #333; padding: 1em; margin: 1em; white-space: pre-wrap; word-break: break-word;">${originalError.message}\n\n${originalError.stack || ''}</pre>
                <h3 style="color: #888;">Error Page Error:</h3>
                <pre style="background: #333; padding: 1em; margin: 1em; white-space: pre-wrap; word-break: break-word;">${errorPageError.message}</pre>
            </div>
        </body></html>
    `
			.trim()
			.replace(/\s+/g, ' ')
	);

	await window.webContents.loadURL(`data:text/html;charset=utf-8,${inlineHtml}`);
}
