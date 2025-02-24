// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
	ping: () => ipcRenderer.send('app:ping'),
	onPong: (callback: (data: any) => void) => {
		ipcRenderer.on('app:pong', (_event, value) => callback(value));
		// Return cleanup function
		return () => {
			ipcRenderer.removeAllListeners('app:pong');
		};
	}
});
