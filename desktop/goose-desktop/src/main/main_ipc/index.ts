import { BrowserWindow } from 'electron';
import { registerBrowserListeners } from './main-event-listeners/browser.listener';
import { registerExtensionListeners } from './main-event-listeners/extension.listener';
import { registerBrowserHandlers } from './main-handle-requests/browser.handler';
import { registerFileSystemHandlers } from './main-handle-requests/file-system.handler';
import { registerSystemHandlers } from './main-handle-requests/system.handler';
import { sendFatalError, sendExtensionUrl } from './main-send-messages/window.sender';

export const ipcMainCode = {
  listeners: {
    browser: (mainWindow: BrowserWindow) => registerBrowserListeners(mainWindow),
    extension: () => registerExtensionListeners()
  },
  handlers: {
    browser: () => registerBrowserHandlers(),
    fileSystem: () => registerFileSystemHandlers(),
    system: () => registerSystemHandlers()
  },
  messages: {
    sendFatalError,
    sendExtensionUrl
  }
};
