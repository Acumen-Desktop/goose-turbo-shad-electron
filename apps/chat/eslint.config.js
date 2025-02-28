import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
// import svelteParser from 'svelte-eslint-parser';
import ts from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    ignores: ['eslint.config.js', 'svelte.config.js'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.ts'],
    languageOptions: {
      // parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
        projectService: true,
        tsconfigRootDir: './tsconfig.json',
      },
    },
  },
  {
    rules: {
      'svelte/sort-attributes': 'warn',
      'svelte/html-quotes': [
        'error',
        {
          prefer: 'double',
          dynamic: {
            quoted: false,
            avoidInvalidUnquotedInHTML: false,
          },
        },
      ],
      'svelte/indent': [
        'error',
        {
          indent: 2,
        },
      ],
      'svelte/max-attributes-per-line': [
        'error',
        {
          multiline: 1,
          singleline: 5,
        },
      ],
      'svelte/mustache-spacing': [
        'error',
        {
          textExpressions: 'never', // or "always"
          attributesAndProps: 'never', // or "always"
          directiveExpressions: 'never', // or "always"
          tags: {
            openingBrace: 'never', // or "always"
            closingBrace: 'never', // or "always" or "always-after-expression"
          },
        },
      ],
      'svelte/no-spaces-around-equal-signs-in-attribute': 'error',
      'svelte/spaced-html-comment': 'error',
      '@typescript-eslint/no-explicit-any': 'error',

      // Prevent unused variables
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-restricted-imports': [
        'warn',
        {
          patterns: ['../../*'],
        },
      ],
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-deprecated': 'warn',
      'prefer-template': 'error',
    },
  },
);
