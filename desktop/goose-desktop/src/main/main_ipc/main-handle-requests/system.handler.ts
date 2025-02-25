import { ipcMain, powerSaveBlocker } from 'electron';
import { IPC } from '../ipc-channels';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getBinaryPath } from '../../../utils/binaryPath';
import log from '../../../utils/logger';
import { ChildProcess } from 'child_process';
import { checkServerStatus, startGoosed } from '../../main_ai/goosed';


const execAsync = promisify(exec);
const goosedProcesses = new Map<number, ChildProcess>();

let powerSaveBlockerId: number | null = null;

export function registerSystemHandlers(app: Electron.App): () => void {
  // export function registerSystemHandlers(): void {
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

  ipcMain.handle(IPC.SYSTEM.CHECK_GOOSED, async () => {
    try {
      // Find any running Goosed process and check its port
      const runningPorts = Array.from(goosedProcesses.keys());
      if (runningPorts.length === 0) {
        log.debug('No Goosed servers currently running');
        return false;
      }

      // Check the first running port
      const port = runningPorts[0];
      log.debug('Checking Goosed server status on port:', port);
      const isRunning = await checkServerStatus(port);
      log.debug('Goosed server status:', isRunning);
      return {'port': port, 'isRunning': isRunning};
    } catch (error) {
      log.error('Error checking Goosed server status:', error);
      return false;
    }
  });

  ipcMain.handle(IPC.SYSTEM.START_GOOSED, async () => {
    try {
      if (!app) {
        throw new Error('App instance is undefined in START_GOOSED handler');
      }
      log.debug('Starting Goosed server with app instance');
      const [port, dir, goosedProcess] = await startGoosed(app, null, null);
      log.debug('Started Goosed server:', { port, pid: goosedProcess.pid });
      goosedProcesses.set(port, goosedProcess);
      return { 'port': port, 'dir': dir, 'pid': goosedProcess.pid };
    } catch (error) {
      log.error('Failed to start Goosed server:', error);
      throw error;
    }
  });

  ipcMain.handle(IPC.SYSTEM.STOP_GOOSED, async (event, port: number) => {
    log.debug('Stopping Goosed server on port:', port);

    if (!port) {
      return { error: 'No port specified' };
    }

    const goosedProcess = goosedProcesses.get(port);
    if (!goosedProcess) {
      return { error: `No goosed process found for port ${port}` };
    }

    try {
      const isWindows = process.platform === 'win32';

      if (isWindows) {
        // On Windows, use taskkill to forcefully terminate the process tree
        const { spawn } = require('child_process');
        spawn('taskkill', ['/pid', goosedProcess.pid.toString(), '/T', '/F']);
      } else {
        // On Unix, kill the process directly
        goosedProcess.kill();
      }

      goosedProcesses.delete(port);
      return { success: true, isRunning: false };
    } catch (error) {
      log.error('Error stopping Goosed process:', error);
      return { error: error.message, isRunning: true };
    }
  });

  // Binary path
  ipcMain.handle(IPC.SYSTEM.GET_BINARY_PATH, async (_, binaryName: string) => {
    try {
      return getBinaryPath(app, binaryName);
    } catch (error) {
      log.error('Error getting binary path:', error);
      throw error;
    }
  });

  return () => {
    // Remove all system handlers
    ipcMain.removeHandler(IPC.SYSTEM.CHECK_OLLAMA);
    ipcMain.removeHandler(IPC.SYSTEM.POWER_SAVE.START);
    ipcMain.removeHandler(IPC.SYSTEM.POWER_SAVE.STOP);
    ipcMain.removeHandler(IPC.SYSTEM.CHECK_GOOSED);
    ipcMain.removeHandler(IPC.SYSTEM.START_GOOSED);
    ipcMain.removeHandler(IPC.SYSTEM.STOP_GOOSED);
    ipcMain.removeHandler(IPC.SYSTEM.GET_BINARY_PATH);

    // Clean up any running processes
    for (const [port, process] of goosedProcesses) {
      try {
        process.kill();
        goosedProcesses.delete(port);
      } catch (error) {
        log.error(`Failed to kill Goosed process on port ${port}:`, error);
      }
    }

    // Clean up power save blocker if active
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
    }
  };
}
