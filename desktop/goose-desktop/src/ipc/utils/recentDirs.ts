import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

const RECENT_DIRS_FILE = path.join(app.getPath('userData'), 'recent-dirs.json');
const MAX_RECENT_DIRS = 10;

/**
 * Load recently used directories
 */
export const loadRecentDirs = (): string[] => {
	try {
		if (fs.existsSync(RECENT_DIRS_FILE)) {
			const data = fs.readFileSync(RECENT_DIRS_FILE, 'utf8');
			return JSON.parse(data);
		}
	} catch (error) {
		console.error('Error loading recent directories:', error);
	}
	return [];
};

/**
 * Add a directory to recent directories list
 */
export const addRecentDir = (dir: string): void => {
	try {
		let recentDirs = loadRecentDirs();

		// Remove if already exists (to move to front)
		recentDirs = recentDirs.filter((d) => d !== dir);

		// Add to front of array
		recentDirs.unshift(dir);

		// Keep only MAX_RECENT_DIRS
		if (recentDirs.length > MAX_RECENT_DIRS) {
			recentDirs = recentDirs.slice(0, MAX_RECENT_DIRS);
		}

		// Save to file
		fs.writeFileSync(RECENT_DIRS_FILE, JSON.stringify(recentDirs, null, 2));
	} catch (error) {
		console.error('Error saving recent directory:', error);
	}
};
