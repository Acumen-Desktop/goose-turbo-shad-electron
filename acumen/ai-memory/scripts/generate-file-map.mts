import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises';
import { basename, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import ignore from 'ignore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple map of filename -> paths[]
type FileMap = {
	[filename: string]: string[];
};

async function getIgnoreFilter(workspaceRoot: string): Promise<(path: string) => boolean> {
	const baseIgnores = [
		'.*/', // Any directory starting with .
		'node_modules', // Common excludes
		'dist',
		'build'
	];

	try {
		const gitignorePath = join(workspaceRoot, '.gitignore');
		const gitignoreContent = await readFile(gitignorePath, 'utf-8');
		const ig = ignore().add(baseIgnores).add(gitignoreContent);
		return (path: string) => !ig.ignores(path);
	} catch (error) {
		console.warn('No .gitignore found, using default ignore patterns');
		const ig = ignore().add(baseIgnores);
		return (path: string) => !ig.ignores(path);
	}
}

async function scanFiles(
	dir: string,
	rootDir: string,
	shouldInclude: (path: string) => boolean
): Promise<FileMap> {
	const fileMap: FileMap = {};

	async function scan(currentDir: string) {
		const items = await readdir(currentDir);

		for (const item of items) {
			const fullPath = join(currentDir, item);
			const relativePath = relative(rootDir, fullPath);

			if (!shouldInclude(relativePath)) {
				continue;
			}

			const stats = await stat(fullPath);

			if (stats.isDirectory()) {
				await scan(fullPath);
			} else {
				const filename = basename(relativePath);
				if (!fileMap[filename]) {
					fileMap[filename] = [];
				}
				fileMap[filename].push(relativePath);
			}
		}
	}

	await scan(dir);

	// Sort the map by keys and sort each path array
	const sortedMap: FileMap = {};
	Object.keys(fileMap)
		.sort()
		.forEach((key) => {
			sortedMap[key] = fileMap[key].sort();
		});

	return sortedMap;
}

async function main() {
	const command = process.argv[2];

	if (command === 'search') {
		const filename = process.argv[3];
		if (!filename) {
			console.error('Please provide a filename to search for');
			process.exit(1);
		}

		try {
			const mapPath = join(__dirname, '../data/file-map.json');
			const mapContent = await readFile(mapPath, 'utf-8');
			const fileMap = JSON.parse(mapContent) as FileMap;

			const paths = fileMap[filename];
			if (paths?.length > 0) {
				console.log(`Found ${filename} in:`);
				paths.forEach((path) => console.log(`  ${path}`));
			} else {
				console.log(`No files found matching: ${filename}`);
			}
		} catch (error) {
			console.error('Error searching map:', error);
			process.exit(1);
		}
		return;
	}

	// Default: generate map
	try {
		const workspaceRoot = join(__dirname, '../../..');

		console.log('Reading .gitignore patterns...');
		const shouldInclude = await getIgnoreFilter(workspaceRoot);

		console.log('Scanning workspace...');
		const fileMap = await scanFiles(workspaceRoot, workspaceRoot, shouldInclude);

		const outputPath = join(__dirname, '../data/file-map.json');
		await mkdir(dirname(outputPath), { recursive: true });
		await writeFile(outputPath, JSON.stringify(fileMap, null, 2));

		const totalFiles = Object.values(fileMap).reduce((sum, paths) => sum + paths.length, 0);
		const uniqueFiles = Object.keys(fileMap).length;

		console.log(`File map generated at: ${outputPath}`);
		console.log(`Total files: ${totalFiles}`);
		console.log(`Unique filenames: ${uniqueFiles}`);
	} catch (error) {
		console.error('Error generating file map:', error);
		process.exit(1);
	}
}

main();
