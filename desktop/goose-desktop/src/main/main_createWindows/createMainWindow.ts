import { BrowserWindow } from 'electron';
import { createWindow } from './utils_window';

export const createMainWindow = async (): Promise<BrowserWindow> => {
	const [window, _goosedProcess] = await createWindow({
		title: 'Goose',
		x: undefined, // Let the OS position the main window
		y: undefined,
		width: 1200,
		height: 800
	});
	
	return window;
};
