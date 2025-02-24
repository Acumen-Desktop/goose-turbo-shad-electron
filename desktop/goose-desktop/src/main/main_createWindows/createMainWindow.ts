import { BrowserWindow } from 'electron';
import { createWindow } from './utils_window';

export const createMainWindow = async (): Promise<BrowserWindow> => {
	const [window] = await createWindow({
		title: 'Goose Main Window'
	});
	
	return window;
};
