import { config as baseConfig } from '@repo/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    // Global ignores
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.svelte-kit/**',
      '**/build/**',
      '**/.turbo/**',
      '**/coverage/**'
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
  }
];
