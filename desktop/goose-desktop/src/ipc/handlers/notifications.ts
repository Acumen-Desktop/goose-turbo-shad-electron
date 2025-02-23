import { Notification } from 'electron';
import type { NotificationData } from '../types/interfaces';
import log from '../../utils/logger';

/**
 * Shows a system notification
 */
export const handleShowNotification = (event: Electron.IpcMainEvent, data: NotificationData) => {
	console.log('NOTIFY', data);
	new Notification({ title: data.title, body: data.body }).show();
};

/**
 * Logs information from the renderer process
 */
export const handleLogInfo = (event: Electron.IpcMainEvent, info: string) => {
	log.info('from renderer:', info);
};
