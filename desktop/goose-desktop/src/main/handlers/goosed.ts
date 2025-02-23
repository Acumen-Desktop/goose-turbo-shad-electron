import { ipcMain, app } from 'electron';
import { IPC_CHANNELS, GoosedResponse } from '../../ipc/types/interfaces';
import type { ChildProcess, ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import path from 'path';

// Store reference to the current goosed process
let currentGoosedProcess: ChildProcess | null = null;

export const startGoosed = async (): Promise<[number, string, ChildProcessWithoutNullStreams]> => {
    // TODO: Get these from config/env
    const port = 49848;
    const workingDir: string = process.cwd();
    
    // Fix path resolution for the goosed binary
    let goosedPath: string;
    if (app.isPackaged) {
        // When running in production
        goosedPath = path.join(process.resourcesPath, 'src', 'bin', 'goosed');
    } else {
        // When running in development
        goosedPath = path.join(app.getAppPath(), 'src', 'bin', 'goosed');
    }

    console.log('Starting goosed from:', goosedPath);
    
    const goosedProcess = spawn(goosedPath, ['--port', port.toString()], {
        cwd: workingDir
    });

    // Handle process output
    goosedProcess.stdout.on('data', (data: Buffer) => {
        console.log(`goosed stdout: ${data.toString()}`);
    });

    goosedProcess.stderr.on('data', (data: Buffer) => {
        console.error(`goosed stderr: ${data.toString()}`);
    });

    goosedProcess.on('error', (err: Error) => {
        console.error('Failed to start goosed process:', err);
        throw err;
    });

    goosedProcess.on('close', (code: number) => {
        console.log(`goosed process exited with code ${code}`);
        currentGoosedProcess = null;
    });

    // Set the current process reference
    currentGoosedProcess = goosedProcess;

    return [port, workingDir, goosedProcess];
};

export const setGoosedProcess = (process: ChildProcess | null) => {
    currentGoosedProcess = process;
};

export const setupGoosedHandlers = () => {
    // First remove any existing handlers to prevent duplicates
    ipcMain.removeHandler(IPC_CHANNELS.CHECK_GOOSED);
    ipcMain.removeHandler(IPC_CHANNELS.STOP_GOOSED);

    // Handler for checking Goosed status
    ipcMain.handle(IPC_CHANNELS.CHECK_GOOSED, async (): Promise<GoosedResponse> => {
        try {
            return {
                isRunning: currentGoosedProcess !== null && !currentGoosedProcess.killed,
                port: 49848  // TODO: Get this dynamically from the process
            };
        } catch (error) {
            return {
                isRunning: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    });

    // Handler for stopping Goosed
    ipcMain.handle(IPC_CHANNELS.STOP_GOOSED, async () => {
        try {
            if (currentGoosedProcess && !currentGoosedProcess.killed) {
                currentGoosedProcess.kill();
                currentGoosedProcess = null;
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    });

    // Return cleanup function
    return () => {
        ipcMain.removeHandler(IPC_CHANNELS.CHECK_GOOSED);
        ipcMain.removeHandler(IPC_CHANNELS.STOP_GOOSED);
        if (currentGoosedProcess && !currentGoosedProcess.killed) {
            currentGoosedProcess.kill();
            currentGoosedProcess = null;
        }
    };
};
