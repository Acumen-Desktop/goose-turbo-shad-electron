import { spawn, ChildProcess } from 'child_process';
import { getBinaryPath } from '../../utils/binaryPath';
import { app } from 'electron';
import path from 'node:path';

let goosedProcess: ChildProcess | null = null;

const findAvailablePort = async (): Promise<number> => {
    // Implementation from GO
    return 49848; // Temporary default, implement proper port finding
};

export const startGoosed = async (): Promise<[number, string, ChildProcess]> => {
    const binaryPath = getBinaryPath(app, 'goosed');
    const port = await findAvailablePort();
    const workingDir = process.env.HOME || process.cwd();

    goosedProcess = spawn(binaryPath, ['agent', '--port', port.toString()], {
        cwd: workingDir
    });

    // Log output for debugging
    goosedProcess.stdout.on('data', (data) => {
        console.log('goosed stdout:', data.toString());
    });

    goosedProcess.stderr.on('data', (data) => {
        console.error('goosed stderr:', data.toString());
    });

    return [port, workingDir, goosedProcess];
};

export const stopGoosed = async (): Promise<void> => {
    if (goosedProcess) {
        goosedProcess.kill();
        goosedProcess = null;
    }
};

export const checkGoosed = async (): Promise<{ isRunning: boolean; port?: number }> => {
    if (!goosedProcess) {
        return { isRunning: false };
    }
    
    try {
        const response = await fetch(`http://127.0.0.1:${findAvailablePort()}/status`);
        return { isRunning: response.ok, port: await findAvailablePort() };
    } catch (error) {
        return { isRunning: false };
    }
};
