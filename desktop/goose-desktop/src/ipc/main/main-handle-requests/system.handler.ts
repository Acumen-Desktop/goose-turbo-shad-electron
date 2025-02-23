import { ipcMain, powerSaveBlocker } from 'electron';
import { IPC } from '../../shared/ipc-channels';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getBinaryPath } from '../../../utils/binaryPath';
import log from '../../../utils/logger';

const execAsync = promisify(exec);

let powerSaveBlockerId: number | null = null;

export function registerSystemHandlers(app: Electron.App): void {
  // Check Ollama process
  ipcMain.handle(IPC.SYSTEM.CHECK_OLLAMA, async () => {
    try {
      const { stdout } = await execAsync('ps aux | grep -iw "[o]llama"');
      return stdout.trim().length > 0;
    } catch (error) {
      log.error('Error checking for Ollama:', error);
      return false;
    }
  });

  // Power save blocker
  ipcMain.handle(IPC.SYSTEM.POWER_SAVE.START, () => {
    log.info('Starting power save blocker...');
    if (powerSaveBlockerId === null) {
      powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
      log.info('Started power save blocker');
      return true;
    }
    return false;
  });

  ipcMain.handle(IPC.SYSTEM.POWER_SAVE.STOP, () => {
    log.info('Stopping power save blocker...');
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
      log.info('Stopped power save blocker');
      return true;
    }
    return false;
  });

  // Binary path
  ipcMain.handle(IPC.SYSTEM.GET_BINARY_PATH, (_, binaryName: string) => {
    return getBinaryPath(app, binaryName);
  });
}
