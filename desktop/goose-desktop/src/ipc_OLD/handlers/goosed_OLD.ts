import { spawn } from 'child_process';
import { createServer } from 'net';
import type { ChildProcessByStdio } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { app } from 'electron';
import { getBinaryPath } from '../../utils/binaryPath';

// Global state for the default goosed instance
let defaultGoosedProcess: ChildProcessByStdio<null, Readable, Readable> | null = null;
let defaultGoosedPort: number | null = null;

// Find an available port to start goosed on
const findAvailablePort = (): Promise<number> => {
	return new Promise((resolve, _reject) => {
		const server = createServer();
		server.listen(0, '127.0.0.1', () => {
			const { port } = server.address() as { port: number };
			server.close(() => {
				console.log(`Line 21 - goosed.ts - Found available port: ${port}`);
				resolve(port);
			});
		});
	});
};

// Check if goosed server is ready by polling the status endpoint
const checkServerStatus = async (
	port: number,
	maxAttempts: number = 60,
	interval: number = 100
): Promise<boolean> => {
	const statusUrl = `http://127.0.0.1:${port}/status`;
	console.log(`Line 34 - goosed.ts - Checking server status at: ${statusUrl}`);

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const response = await fetch(statusUrl);
			if (response.ok) {
				console.log(`Line 40 - goosed.ts - Server is ready after ${attempt} attempts`);
				return true;
			}
		} catch (error) {
			// Expected error when server isn't ready yet
			if (attempt === maxAttempts) {
				console.error(
					`Line 46 - goosed.ts - Server failed to respond after ${maxAttempts} attempts:`,
					error
				);
			}
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
	return false;
};

export const startGoosed = async (
	workingDir: string | null = null,
	env: Record<string, string> = {}
): Promise<[number, string, ChildProcessByStdio<null, Readable, Readable>]> => {
	// Default to home directory if not specified
	const homeDir = os.homedir();
	const isWindows = process.platform === 'win32';
	const dir = workingDir ? path.normalize(workingDir) : homeDir;

	// Get the goosed binary path
	let goosedPath = getBinaryPath(app, 'goosed');
	const port = await findAvailablePort();

	console.log(
		`Line 66 - goosed.ts - Starting goosed from: ${goosedPath} on port ${port} in dir ${dir}`
	);

	// Define environment variables
	const processEnv = {
		...process.env,
		HOME: homeDir,
		USERPROFILE: homeDir,
		APPDATA: process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming'),
		LOCALAPPDATA: process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local'),
		PATH: `${path.dirname(goosedPath)}${path.delimiter}${process.env.PATH}`,
		GOOSE_PORT: String(port),
		...env
	};

	// Ensure proper executable path on Windows
	if (isWindows && !goosedPath.toLowerCase().endsWith('.exe')) {
		goosedPath += '.exe';
	}

	// Verify binary exists
	try {
		const fs = require('fs');
		const stats = fs.statSync(goosedPath);
		if (!stats.isFile()) {
			throw new Error('Not a file');
		}
	} catch (error) {
		console.error(`Line 91 - goosed.ts - Binary not found at ${goosedPath}:`, error);
		throw new Error(`Binary not found at ${goosedPath}`);
	}

	// Spawn options
	const spawnOptions = {
		cwd: dir,
		env: processEnv,
		stdio: ['ignore', 'pipe', 'pipe'] as ['ignore', 'pipe', 'pipe'],
		windowsHide: true,
		detached: isWindows,
		shell: false
	};

	// Spawn the goosed process
	const goosedProcess = spawn(goosedPath, ['agent'], spawnOptions);

	// Set up event handlers
	goosedProcess.stdout.on('data', (data) => {
		console.log(`Line 110 - goosed.ts - goosed stdout: ${data.toString()}`);
	});

	goosedProcess.stderr.on('data', (data) => {
		console.error(`Line 114 - goosed.ts - goosed stderr: ${data.toString()}`);
	});

	goosedProcess.on('close', (code) => {
		console.log(`Line 118 - goosed.ts - goosed process exited with code ${code}`);
		if (defaultGoosedProcess === goosedProcess) {
			defaultGoosedProcess = null;
			defaultGoosedPort = null;
		}
	});

	goosedProcess.on('error', (err) => {
		console.error(`Line 124 - goosed.ts - Failed to start goosed:`, err);
		if (defaultGoosedProcess === goosedProcess) {
			defaultGoosedProcess = null;
			defaultGoosedPort = null;
		}
		throw err;
	});

	// Wait for server to be ready
	const isReady = await checkServerStatus(port);
	if (!isReady) {
		if (goosedProcess) {
			goosedProcess.kill();
		}
		throw new Error(`Goosed server failed to start on port ${port}`);
	}

	// If this is the first instance, make it the default
	if (!defaultGoosedProcess) {
		defaultGoosedProcess = goosedProcess;
		defaultGoosedPort = port;
	}

	console.log(`Line 136 - goosed.ts - Goosed server successfully started on port ${port}`);
	return [port, dir, goosedProcess];
};

export const stopGoosed = async (
	processToStop?: ChildProcessByStdio<null, Readable, Readable>
): Promise<void> => {
	const goosedProcess = processToStop || defaultGoosedProcess;
	if (!goosedProcess) {
		return;
	}

	console.log('Line 144 - goosed.ts - Stopping goosed server');
	const isWindows = process.platform === 'win32';

	try {
		if (isWindows && goosedProcess.pid) {
			spawn('taskkill', ['/pid', goosedProcess.pid.toString(), '/T', '/F']);
		} else {
			goosedProcess.kill();
		}
	} catch (error) {
		console.error('Line 154 - goosed.ts - Error while terminating goosed process:', error);
	}

	if (goosedProcess === defaultGoosedProcess) {
		defaultGoosedProcess = null;
		defaultGoosedPort = null;
	}
};

export const checkGoosed = (): { isRunning: boolean; port: number | null } => {
	return {
		isRunning: defaultGoosedProcess !== null,
		port: defaultGoosedPort
	};
};

// Clean up when app quits
app.on('will-quit', () => {
	if (defaultGoosedProcess) {
		stopGoosed(defaultGoosedProcess);
	}
});
