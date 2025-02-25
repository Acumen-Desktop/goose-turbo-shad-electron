import { spawn } from 'child_process';
import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  MenuItem,
  Notification,
  powerSaveBlocker,
  Tray,
} from 'electron';
import path from 'node:path';
import { startGoosed } from '../main_ai/goosed';
import { getBinaryPath } from '../../utils/binaryPath';
import { loadShellEnv } from '../../utils/loadEnv';
import log from '../../utils/logger';
import { addRecentDir, loadRecentDirs } from '../../utils/recentDirs';
import {
  createEnvironmentMenu,
  EnvToggles,
  loadSettings,
  saveSettings,
  updateEnvironmentVariables,
} from '../../utils/settings';
import * as crypto from 'crypto';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);

// State for environment variable toggles
let envToggles: EnvToggles = loadSettings().envToggles;

// Track windows by ID
let windowCounter = 0;
const windowMap = new Map<number, BrowserWindow>();

export const getGooseProvider = () => {
  loadShellEnv(app.isPackaged);
  return [process.env.GOOSE_PROVIDER, process.env.GOOSE_MODEL];
};

export const generateSecretKey = () => {
  const key = crypto.randomBytes(32).toString('hex');
  process.env.GOOSE_SERVER__SECRET_KEY = key;
  return key;
};



export const createTray = () => {
  const isDev = process.env.NODE_ENV === 'development';
  let iconPath: string;

  if (isDev) {
    iconPath = path.join(process.cwd(), 'src', 'images', 'iconTemplate.png');
  } else {
    iconPath = path.join(process.resourcesPath, 'images', 'iconTemplate.png');
  }

  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Window', click: showWindow },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setToolTip('Goose');
  tray.setContextMenu(contextMenu);
};

export const showWindow = () => {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    log.info('No windows are currently open.');
    return;
  }

  const initialOffsetX = 30;
  const initialOffsetY = 30;

  windows.forEach((win, index) => {
    const currentBounds = win.getBounds();
    const newX = currentBounds.x + initialOffsetX * index;
    const newY = currentBounds.y + initialOffsetY * index;

    win.setBounds({
      x: newX,
      y: newY,
      width: currentBounds.width,
      height: currentBounds.height,
    });

    if (!win.isVisible()) {
      win.show();
    }
    win.focus();
  });
};

export const buildRecentFilesMenu = () => {
  const recentDirs = loadRecentDirs();
  return recentDirs.map((dir) => ({
    label: dir,
    click: () => {
      createChat(app, undefined, dir);
    },
  }));
};

export const openDirectoryDialog = async (replaceWindow: boolean = false) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    addRecentDir(result.filePaths[0]);
    if (replaceWindow) {
      BrowserWindow.getFocusedWindow().close();
    }
    createChat(app, undefined, result.filePaths[0]);
  }
};

export const handleFatalError = (error: Error) => {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach((win) => {
    win.webContents.send('fatal-error', error.message || 'An unexpected error occurred');
  });
};

export const setupIpcHandlers = () => {
  ipcMain.handle('select-file-or-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('check-ollama', async () => {
    try {
      return new Promise((resolve) => {
        exec('ps aux | grep -iw "[o]llama"', (error, stdout, stderr) => {
          if (error) return resolve(false);
          if (stderr) return resolve(false);
          resolve(stdout.trim().length > 0);
        });
      });
    } catch (err) {
      console.error('Error checking for Ollama:', err);
      return false;
    }
  });

  ipcMain.on('create-chat-window', (_, query, dir, version) => {
    createChat(app, query, dir, version);
  });

  ipcMain.on('directory-chooser', (_, replace: boolean = false) => {
    openDirectoryDialog(replace);
  });

  ipcMain.on('notify', (event, data) => {
    new Notification({ title: data.title, body: data.body }).show();
  });

  ipcMain.on('logInfo', (_, info) => {
    log.info('from renderer:', info);
  });

  ipcMain.on('reload-app', () => {
    app.relaunch();
    app.exit(0);
  });

  let powerSaveBlockerId: number | null = null;
  ipcMain.handle('start-power-save-blocker', () => {
    if (powerSaveBlockerId === null) {
      powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
      return true;
    }
    return false;
  });

  ipcMain.handle('stop-power-save-blocker', () => {
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
      return true;
    }
    return false;
  });

  ipcMain.handle('get-binary-path', (event, binaryName) => {
    return getBinaryPath(app, binaryName);
  });

  ipcMain.handle('fetch-metadata', async (_, url) => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Goose/1.0)',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.text();
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  });

  ipcMain.on('open-in-chrome', (_, url) => {
    if (process.platform === 'darwin') {
      spawn('open', ['-a', 'Google Chrome', url]);
    } else if (process.platform === 'win32') {
      spawn('cmd.exe', ['/c', 'start', '', 'chrome', url]);
    } else {
      spawn('xdg-open', [url]);
    }
  });
};
