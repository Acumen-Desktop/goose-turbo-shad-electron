import { ipcMain, app, Notification } from 'electron';
import { IPC } from '../ipc-channels';
import { ChatWindowOptions, NotificationData } from '../types';
import { createChat } from '../../../main/chat';
import { openDirectoryDialog } from '../../../main/directory';
import log from '../../../utils/logger';

export function registerWindowListeners(): void {
  // Chat window creation
  ipcMain.on(IPC.WINDOW.CREATE_CHAT, (_, options: ChatWindowOptions) => {
    createChat(app, options.query, options.dir, options.version);
  });

  // Directory chooser
  ipcMain.on(IPC.FILE_SYSTEM.CHOOSE_DIRECTORY, (_, replace: boolean = false) => {
    openDirectoryDialog(replace);
  });

  // App reload
  ipcMain.on(IPC.SYSTEM.RELOAD_APP, () => {
    app.relaunch();
    app.exit(0);
  });

  // Notifications
  ipcMain.on(IPC.NOTIFICATION.SHOW, (_, data: NotificationData) => {
    new Notification({ title: data.title, body: data.body }).show();
  });

  // Logging
  ipcMain.on(IPC.NOTIFICATION.LOG_INFO, (_, info: string) => {
    log.info('from renderer:', info);
  });
}
