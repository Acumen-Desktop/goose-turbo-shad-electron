import path from 'node:path';
import { App } from 'electron';

/**
 * Gets the path of a binary based on the environment
 */
export const getBinaryPath = (app: App, binaryName: string): string => {
	const isDev = process.env.NODE_ENV === 'development';

	if (isDev) {
		return path.join(process.cwd(), 'bin', binaryName);
	}

	return path.join(process.resourcesPath, 'bin', binaryName);
};
