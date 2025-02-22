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

// Get the window interface that was exposed by the preload script
declare global {
	interface Window {
		electron: {
			ping: () => void;
			onPong: (callback: (data: any) => void) => () => void;
		};
	}
}

// Get DOM elements
const pingButton = document.getElementById('pingButton') as HTMLButtonElement;
const responseDiv = document.getElementById('response') as HTMLDivElement;

// Add click handler for the ping button
pingButton?.addEventListener('click', () => {
	responseDiv.textContent = 'Sending ping...';
	window.electron.ping();
});

// Set up the pong listener
const cleanup = window.electron.onPong((data) => {
	responseDiv.textContent = `Received: ${JSON.stringify(data, null, 2)}`;
});

// Clean up the listener when the window unloads
window.addEventListener('unload', cleanup);

console.warn('👋 This message is being logged by "renderer.ts", included via Vite');
