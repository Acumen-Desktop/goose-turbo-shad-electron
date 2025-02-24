import type { ChildProcess } from 'child_process';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { BrowserWindow } from 'electron';
import { startGoosed, setGoosedProcess } from '../handlers/goosed_OLD';

export const createWindow = async (options: {
  title: string;
  x?: number;
  y?: number;
  width: number;
  height: number;
}): Promise<[BrowserWindow, ChildProcess]> => {
  const [port, dir, goosedProcess] = await startGoosed();

  const window = new BrowserWindow({
    x: options.x ?? 2048,
    y: options.y ?? 0,
    width: options.width ?? 1800,
    height: options.height ?? 1000,
    title: options.title,
    backgroundColor: '#000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [
        JSON.stringify({
          GOOSE_PORT: port,
          GOOSE_WORKING_DIR: dir
        })
      ]
    }
  });

  window.on('closed', () => {
    if (goosedProcess) {
      goosedProcess.kill();
    }
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    await window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  window.webContents.openDevTools();

  setGoosedProcess(goosedProcess);

  return [window, goosedProcess];
}

export async function handleWindowLoadError(
  window: BrowserWindow,
  err: Error,
  appUrl: string | undefined
): Promise<void> {
  // ... existing error handling code ...
}

export function setupWindowLogging(window: BrowserWindow): void {
  // ... existing logging code ...
}
