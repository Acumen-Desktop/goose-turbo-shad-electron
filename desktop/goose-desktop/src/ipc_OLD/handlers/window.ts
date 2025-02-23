import { BrowserWindow, dialog } from 'electron';
import { IPC_CHANNELS } from '../types/interfaces';
import { addRecentDir } from '../../utils/recentDirs';

/**
 * Creates a new chat window
 */
export const handleCreateChatWindow = async (
	event: Electron.IpcMainEvent,
	query?: string,
	dir?: string,
	version?: string
) => {
	// Implementation will be added when we have the window creation logic
	// This is just a placeholder for the IPC handler structure
	console.log('Create chat window:', { query, dir, version });
};

/**
 * Creates a wing-to-wing window
 */
export const handleCreateWingToWingWindow = (event: Electron.IpcMainEvent, query: string) => {
	console.log('Create wing-to-wing window:', query);
};

/**
 * Hides the current window
 */
export const handleHideWindow = (event: Electron.IpcMainEvent) => {
	const window = BrowserWindow.fromWebContents(event.sender);
	if (window) {
		window.hide();
	}
};

/**
 * Opens a directory chooser dialog
 */
export const handleDirectoryChooser = async (
	event: Electron.IpcMainEvent,
	replaceWindow: boolean = false
) => {
	const result = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});

	if (!result.canceled && result.filePaths.length > 0) {
		const selectedPath = result.filePaths[0];
		addRecentDir(selectedPath);

		if (replaceWindow) {
			const currentWindow = BrowserWindow.fromWebContents(event.sender);
			if (currentWindow) {
				currentWindow.close();
			}
		}

		// Create new window with selected directory
		// Implementation will be added when we have window creation logic
		console.log('Selected directory:', selectedPath);
	}
};

/**
 * Handles file/directory selection
 */
export const handleSelectFileOrDirectory = async () => {
	const result = await dialog.showOpenDialog({
		properties: ['openFile', 'openDirectory']
	});

	if (!result.canceled && result.filePaths.length > 0) {
		return result.filePaths[0];
	}
	return null;
};
