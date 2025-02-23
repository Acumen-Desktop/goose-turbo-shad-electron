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
      onPong: (callback: (data: { message: string; timestamp: string }) => void) => () => void;
      // Commenting out goosed interfaces until implemented
      /*
      startGoosed: (
        workingDir?: string
      ) => Promise<{ isRunning: boolean; port?: number; error?: string }>;
      stopGoosed: () => Promise<{ isRunning: boolean; error?: string }>;
      checkGoosed: () => Promise<{ isRunning: boolean; port?: number }>;
      */
    };
  }
}

// Get button elements
const pingButton = document.getElementById('pingButton') as HTMLButtonElement;
const responseDiv = document.getElementById('response') as HTMLDivElement;
/* Commenting out goosed elements until implemented
const startGoosedButton = document.getElementById('startGoosed') as HTMLButtonElement;
const stopGoosedButton = document.getElementById('stopGoosed') as HTMLButtonElement;
const checkGoosedButton = document.getElementById('checkGoosed') as HTMLButtonElement;
const goosedStatusDiv = document.getElementById('goosed-status') as HTMLDivElement;
*/

// Add click handler for ping button
pingButton?.addEventListener('click', () => {
  const timestamp = new Date().toISOString();
  responseDiv.innerHTML = `[${timestamp}] Sending ping...\n`;
  window.electron.ping();
});

// Listen for pong responses
window.electron.onPong((data) => {
  responseDiv.innerHTML += `[${data.timestamp}] Received: ${data.message}\n`;
});

/* Commenting out goosed functionality until implemented
// Function to update button states based on goosed running status
function updateButtonStates(isRunning: boolean) {
  startGoosedButton.disabled = isRunning;
  stopGoosedButton.disabled = !isRunning;
}

// Add click handler for start goosed button
startGoosedButton?.addEventListener('click', async () => {
  const timestamp = new Date().toISOString();
  goosedStatusDiv.innerHTML = `[${timestamp}] Starting goosed...\n`;
  
  try {
    const result = await window.electron.startGoosed();
    if (result.error) {
      goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Error: ${result.error}\n`;
    } else {
      goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Goosed running on port ${result.port}\n`;
    }
    updateButtonStates(result.isRunning);
  } catch (error) {
    goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Error: ${error}\n`;
  }
});

// Add click handler for stop goosed button
stopGoosedButton?.addEventListener('click', async () => {
  const timestamp = new Date().toISOString();
  goosedStatusDiv.innerHTML = `[${timestamp}] Stopping goosed...\n`;
  
  try {
    const result = await window.electron.stopGoosed();
    if (result.error) {
      goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Error: ${result.error}\n`;
    } else {
      goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Goosed stopped\n`;
    }
    updateButtonStates(result.isRunning);
  } catch (error) {
    goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Error: ${error}\n`;
  }
});

// Add click handler for check goosed button
checkGoosedButton?.addEventListener('click', async () => {
  const timestamp = new Date().toISOString();
  goosedStatusDiv.innerHTML = `[${timestamp}] Checking goosed status...\n`;
  
  try {
    const result = await window.electron.checkGoosed();
    if (result.isRunning) {
      goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Goosed is running on port ${result.port}\n`;
    } else {
      goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Goosed is not running\n`;
    }
    updateButtonStates(result.isRunning);
  } catch (error) {
    goosedStatusDiv.innerHTML += `[${new Date().toISOString()}] Error: ${error}\n`;
  }
});

// Check initial status
window.electron.checkGoosed().then((status) => {
  updateButtonStates(status.isRunning);
}).catch((error) => {
  console.error('Failed to check initial goosed status:', error);
  updateButtonStates(false);
});
*/

console.warn('👋 This message is being logged by "renderer.ts", included via Vite');
