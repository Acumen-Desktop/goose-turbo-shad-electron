/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { IPC_CHANNELS } from '../ipc_OLD/types/interfaces';

// Get the window interface that was exposed by the preload script
declare global {
	interface Window {
		electron: {
			ping: () => void;
			onPong: (callback: (data: any) => void) => () => void;
			startGoosed: (
				workingDir?: string
			) => Promise<{ isRunning: boolean; port?: number; error?: string }>;
			stopGoosed: () => Promise<{ isRunning: boolean; error?: string }>;
			checkGoosed: () => Promise<{ isRunning: boolean; port?: number }>;
			on: (channel: string, callback: (...args: any[]) => void) => void;
			off: (channel: string, callback: (...args: any[]) => void) => void;
		};
	}
}

// Get button elements
const startGoosedButton = document.getElementById('startGoosed') as HTMLButtonElement;
const stopGoosedButton = document.getElementById('stopGoosed') as HTMLButtonElement;
const checkGoosedButton = document.getElementById('checkGoosed') as HTMLButtonElement;
const goosedStatusDiv = document.getElementById('goosed-status') as HTMLDivElement;

const updateButtonStates = (isRunning: boolean) => {
	startGoosedButton.disabled = isRunning;
	stopGoosedButton.disabled = !isRunning;
};

// Add click handler for start goosed button
startGoosedButton?.addEventListener('click', async () => {
	const timestamp = new Date().toISOString();
	goosedStatusDiv.innerHTML = `[${timestamp}] Starting goosed...\n`;
	try {
		const result = await window.electron.startGoosed();
		const currentContent = goosedStatusDiv.innerHTML;
		goosedStatusDiv.innerHTML = `${currentContent}[${timestamp}] ${result.isRunning ? `Started on port ${result.port}` : `Failed: ${result.error}`
			}\n`;
		updateButtonStates(result.isRunning);
	} catch (error) {
		const currentContent = goosedStatusDiv.innerHTML;
		goosedStatusDiv.innerHTML = `${currentContent}[${timestamp}] Error: ${error.message}\n`;
		updateButtonStates(false);
	}
});

// Add click handler for check status button
checkGoosedButton?.addEventListener('click', async () => {
	const timestamp = new Date().toISOString();
	try {
		const status = await window.electron.checkGoosed();
		goosedStatusDiv.innerHTML = `[${timestamp}] Status: ${status.isRunning ? `Running on port ${status.port}` : 'Not running'
			}\n`;
		updateButtonStates(status.isRunning);
	} catch (error) {
		goosedStatusDiv.innerHTML = `[${timestamp}] Error checking status: ${error.message}\n`;
		updateButtonStates(false);
	}
});

// Add click handler for stop goosed button
stopGoosedButton?.addEventListener('click', async () => {
	const timestamp = new Date().toISOString();
	goosedStatusDiv.innerHTML = `[${timestamp}] Stopping goosed...\n`;
	try {
		const result = await window.electron.stopGoosed();
		const currentContent = goosedStatusDiv.innerHTML;
		goosedStatusDiv.innerHTML = `${currentContent}[${timestamp}] ${result.isRunning ? `Failed: ${result.error}` : 'Stopped successfully'
			}\n`;
		updateButtonStates(result.isRunning);
	} catch (error) {
		const currentContent = goosedStatusDiv.innerHTML;
		goosedStatusDiv.innerHTML = `${currentContent}[${timestamp}] Error: ${error.message}\n`;
		updateButtonStates(true);
	}
});

// Check initial status
window.electron.checkGoosed().then((status) => {
	updateButtonStates(status.isRunning);
}).catch((error) => {
	console.error('Failed to check initial goosed status:', error);
	updateButtonStates(false);
});

console.warn('👋 This message is being logged by "renderer.ts", included via Vite');
