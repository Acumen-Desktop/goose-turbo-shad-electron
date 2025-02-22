import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import waitOn from 'wait-on';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

const APPS = ['web', 'docs', 'shad_starter'] as const;
type App = (typeof APPS)[number];

// Store all processes for cleanup
const processes: ReturnType<typeof spawn>[] = [];

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

	const selectedApp = response.app as App;
	if (!selectedApp) {
		console.log('No app selected, exiting...');
		process.exit(0);
	}

	try {
		const appPath = resolve(ROOT_DIR, '..', '..', 'apps', selectedApp);
		console.log(`Starting ${selectedApp} app...`);

		// Start the app's dev server
		const appProcess = spawn('yarn', ['dev'], {
			cwd: appPath,
			stdio: 'inherit',
			shell: true
		});
		processes.push(appProcess);

		// Wait for the dev server to be ready
		await waitOn({
			resources: ['http-get://localhost:5175'],
			timeout: 30000
		});

		console.log('Dev server is ready, starting Electron...');

		// Start electron with the main process
		const electronProcess = spawn('electron', ['.'], {
			cwd: ROOT_DIR,
			stdio: 'inherit',
			env: {
				...process.env,
				ELECTRON_APP_URL: 'http://localhost:5175',
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
