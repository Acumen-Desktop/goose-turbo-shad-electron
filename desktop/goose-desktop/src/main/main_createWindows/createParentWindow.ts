import { BrowserWindow } from 'electron';
import { createWindow } from './utils_window';

export const createParentWindow = async (): Promise<BrowserWindow> => {
	const [window, _goosedProcess] = await createWindow({
		title: 'Goose - Parent Window'
	});
	
	return window;
};
