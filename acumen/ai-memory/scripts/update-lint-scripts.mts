import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workspaceRoot = join(__dirname, '../../..');
const appPaths = ['apps/docs', 'apps/shad_starter', 'apps/web'];

async function updatePackageJson(packagePath: string) {
	const packageJsonPath = join(workspaceRoot, packagePath, 'package.json');
	const content = await readFile(packageJsonPath, 'utf-8');
	const pkg = JSON.parse(content);

	// Update scripts
	if (!pkg.scripts) {
		pkg.scripts = {};
	}

	// Update the lint script to ignore dot folders
	pkg.scripts.lint = 'prettier --ignore-path ../../.prettierignore --check . && eslint --ignore-pattern ".*" .';
	
	// Add format script using root prettier config
	pkg.scripts.format = 'prettier --ignore-path ../../.prettierignore --write .';

	await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
	console.log(`Updated ${packagePath}/package.json`);
}

async function main() {
	for (const path of appPaths) {
		await updatePackageJson(path);
	}
}

main().catch(console.error);
