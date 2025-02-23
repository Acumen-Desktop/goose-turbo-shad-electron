import { exec as execCallback, spawn } from 'child_process';
import { promisify } from 'util';
import { app, powerSaveBlocker } from 'electron';
import { getBinaryPath } from '../../utils/binaryPath';

const exec = promisify(execCallback);

let powerSaveBlockerId: number | null = null;

/**
 * Opens a URL in Chrome browser
 */
export const handleOpenInChrome = (event: Electron.IpcMainEvent, url: string) => {
	if (process.platform === 'darwin') {
		spawn('open', ['-a', 'Google Chrome', url]);
	} else if (process.platform === 'win32') {
		spawn('cmd.exe', ['/c', 'start', '', 'chrome', url]);
	} else {
		spawn('xdg-open', [url]);
	}
};

/**
 * Fetches metadata from a URL
 */
export const handleFetchMetadata = async (
	event: Electron.IpcMainInvokeEvent,
	url: string
): Promise<string> => {
	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; Goose/1.0)'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.text();
	} catch (error) {
		console.error('Error fetching metadata:', error);
		throw error;
	}
};

/**
 * Reloads the application
 */
export const handleReloadApp = () => {
	app.relaunch();
	app.exit(0);
};

/**
 * Gets the path of a binary
 */
export const handleGetBinaryPath = (
	event: Electron.IpcMainInvokeEvent,
	binaryName: string
): string => {
	return getBinaryPath(app, binaryName);
};

/**
 * Starts the power save blocker
 */
export const handleStartPowerSaveBlocker = (): boolean => {
	console.log('Starting power save blocker...');
	if (powerSaveBlockerId === null) {
		powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
		console.log('Started power save blocker');
		return true;
	}
	return false;
};

/**
 * Stops the power save blocker
 */
export const handleStopPowerSaveBlocker = (): boolean => {
	console.log('Stopping power save blocker...');
	if (powerSaveBlockerId !== null) {
		powerSaveBlocker.stop(powerSaveBlockerId);
		powerSaveBlockerId = null;
		console.log('Stopped power save blocker');
		return true;
	}
	return false;
};

/**
 * Checks if Ollama is running
 */
export const handleCheckOllama = async (): Promise<boolean> => {
	try {
		// Run `ps` and filter for "ollama"
		const { stdout } = await exec('ps aux | grep -iw "[o]llama"');
		return stdout.trim().length > 0;
	} catch (error) {
		console.error('Error checking for Ollama:', error);
		return false;
	}
};
