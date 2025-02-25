import { app, BrowserWindow } from 'electron';
import { registerIpcHandlers, removeIpcHandlers } from '../ipc_OLD/handlers';

export const setupErrorHandlers = () => {
  process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
};

export const setupWindowHandlers = (window: BrowserWindow) => {
  const handlers = {
    onLoadFail: (event: Event, errorCode: number, errorDescription: string) => {
      console.error('Failed to load window content:', { errorCode, errorDescription });
    },
    onLoadFinish: () => {
      console.log('Window content loaded successfully');
      registerIpcHandlers();
      window?.webContents.send('app:ready');
    }
  };

  window.webContents.on('did-fail-load', handlers.onLoadFail);
  window.webContents.on('did-finish-load', handlers.onLoadFinish);

  return () => {
    window.webContents.off('did-fail-load', handlers.onLoadFail);
    window.webContents.off('did-finish-load', handlers.onLoadFinish);
  };
};

export const setupAppHandlers = () => {
  app.on('window-all-closed', () => app.quit());

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      // We'll need to handle this differently since initializeApp won't be available here
      app.emit('ready');
    }
  });

  app.on('will-quit', removeIpcHandlers);
};