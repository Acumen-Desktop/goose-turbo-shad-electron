/* eslint-disable @typescript-eslint/no-require-imports */
const { config: baseConfig } = require('@acumen-desktop/eslint-config');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
	...baseConfig,
	{
		ignores: ['dist/**', '.vite/**', 'node_modules/**', 'out/**']
	},
	{
		files: ['**/*.{js,ts,mts,cts}'],
		rules: {
			// Add any desktop-specific rules here
		}
	}
];
