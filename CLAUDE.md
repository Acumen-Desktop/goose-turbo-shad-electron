# Goose Desktop Project Guide

## Build Commands
- Build all: `yarn build`
- Dev mode: `yarn dev`
- Type checking: `yarn check-types`
- Format code: `yarn format`
- Lint code: `yarn lint`
- Fix linting issues: `yarn lint:fix`
- Run application: `yarn start`
- Run application with extensions: `yarn start:apps`
- Run single test: `yarn workspace @goose/web vitest run <test-file-path>`
- Run tests with coverage: `yarn workspace @goose/desktop test:coverage`

## Code Style Guidelines
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Imports**: Sort imports using `@ianvs/prettier-plugin-sort-imports` configuration
- **TypeScript**: Use strict typing - no `any` unless necessary
- **Components**: Create Svelte components using the latest Svelte 5 syntax
- **Error Handling**: Use try/catch for async operations and properly log errors
- **UI Components**: Use the shared UI package with shadcn components
- **Workspace References**: Always use `workspace:*` for internal dependencies
- **Namespaces**: Use `@goose/` prefix for all package names

## Architecture
This is a monorepo using Yarn 4 workspaces and Turborepo for build orchestration.