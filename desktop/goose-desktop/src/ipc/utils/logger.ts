import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

// Log file path
const LOG_FILE = path.join(app.getPath('userData'), 'goose.log');

// Ensure log directory exists
const logDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

interface Logger {
	info: (message: string, ...args: any[]) => void;
	error: (message: string, ...args: any[]) => void;
	warn: (message: string, ...args: any[]) => void;
	debug: (message: string, ...args: any[]) => void;
}

/**
 * Creates a logger instance for a specific module
 */
export const createLogger = (module: string): Logger => {
	const timestamp = () => new Date().toISOString();

	const writeToFile = (level: string, message: string, ...args: any[]) => {
		const logMessage = `${timestamp()} [${level}] [${module}] ${message} ${args.length ? JSON.stringify(args) : ''}`;
		fs.appendFileSync(LOG_FILE, logMessage + '\n');

		// Also log to console in development
		if (process.env.NODE_ENV === 'development') {
			console.log(logMessage);
		}
	};

	return {
		info: (message: string, ...args: any[]) => writeToFile('INFO', message, ...args),
		error: (message: string, ...args: any[]) => writeToFile('ERROR', message, ...args),
		warn: (message: string, ...args: any[]) => writeToFile('WARN', message, ...args),
		debug: (message: string, ...args: any[]) => {
			if (process.env.NODE_ENV === 'development') {
				writeToFile('DEBUG', message, ...args);
			}
		}
	};
};
