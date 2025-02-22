import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import waitOn from 'wait-on';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

const APPS = ['web', 'docs', 'shad_starter'];

// Store all processes for cleanup
const processes = [];

// Handle cleanup
function cleanup() {
	for (const proc of processes) {
		try {
			proc.kill();
		} catch (err) {
			console.error('Error killing process:', err);
		}
	}
	process.exit(0);
}

async function main() {
	// Set up process cleanup
	process.on('SIGINT', cleanup);
	process.on('SIGTERM', cleanup);

	// Get user selection
	const response = await prompts({
		type: 'select',
		name: 'app',
		message: 'Select an app to run in electron:',
		choices: APPS.map((app) => ({ title: app, value: app }))
	});

	const selectedApp = response.app;
	if (!selectedApp) {
		console.log('No app selected, exiting...');
		process.exit(0);
	}

	try {
		const appPath = resolve(ROOT_DIR, '..', '..', 'apps', selectedApp);
		console.log(`Line 48 - Starting ${selectedApp} app...`);

		// Start the app's dev server with captured output
		const appProcess = spawn('yarn', ['dev'], {
			cwd: appPath,
			shell: true
		});
		processes.push(appProcess);

		// Promise to get the port from Vite's output
		const getPort = new Promise((resolve, reject) => {
			let port = null;
			const timeout = setTimeout(() => {
				reject(new Error('Timeout waiting for Vite to start'));
			}, 30000);

			appProcess.stdout.on('data', (data) => {
				const output = data.toString();
				console.log('Line 66 - Vite output:', output); // Keep showing output to user

				// Look for Vite's local URL message
				const match = output.match(/Local:\s+http:\/\/localhost:(\d+)/);
				if (match && match[1]) {
					port = match[1];
					clearTimeout(timeout);
					resolve(port);
				}
			});

			appProcess.stderr.on('data', (data) => {
				console.error(data.toString());
			});

			appProcess.on('error', (err) => {
				clearTimeout(timeout);
				reject(err);
			});
		});

		// Wait for Vite to output its port
		const port = await getPort;
		console.log(`Line 89 - Vite server started on port ${port}`);

		// Wait for the dev server to be ready
		await waitOn({
			resources: [`http-get://localhost:${port}`],
			timeout: 30000
		});

		console.log('Line 97 - Dev server is ready, starting Electron...');

		// Build TypeScript files
		console.log('Building TypeScript files...');
		const buildProcess = spawn('yarn', ['build'], {
			cwd: ROOT_DIR,
			stdio: 'inherit',
			shell: true
		});

		await new Promise((resolve, reject) => {
			buildProcess.on('exit', (code) => {
				if (code === 0) resolve();
				else reject(new Error(`Build failed with code ${code}`));
			});
		});

		// Start electron using yarn
		const electronProcess = spawn('yarn', ['electron', '.'], {
			cwd: ROOT_DIR,
			stdio: 'inherit',
			env: {
				...process.env,
				ELECTRON_APP_URL: `http://localhost:${port}`,
				SELECTED_APP: selectedApp
			},
			shell: true
		});
		processes.push(electronProcess);

		electronProcess.on('close', cleanup);
		appProcess.on('close', cleanup);
	} catch (error) {
		console.error('Failed to start development environment:', error);
		cleanup();
	}
}

main().catch((error) => {
	console.error('Unhandled error:', error);
	cleanup();
});
