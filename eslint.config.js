import { config as baseConfig } from '@acumen-desktop/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
	...baseConfig,
	{
		// Global ignores
		ignores: [
			'**/.*/**', // Ignore all files in dot-folders
			'**/node_modules/**',
			'**/dist/**',
			'**/build/**',
			'**/coverage/**',
			'**/package/**',
			'**/.svelte-kit/**' // Explicitly ignore SvelteKit output
		]
	},
	// UI Package
	{
		files: ['packages/ui/**/*.{js,ts,svelte}'],
		rules: {
			// Add any UI-specific rules here
		}
	},
	// Apps
	{
		files: ['apps/**/*.{js,ts,svelte}'],
		rules: {
			// Add any app-specific rules here
		}
	},
	// SvelteKit apps
	{
		files: ['apps/**/src/**/*.{js,ts,svelte}']
	}
];
