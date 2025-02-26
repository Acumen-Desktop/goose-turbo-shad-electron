# Goose Turbo Shad Electron

## Project Overview

This project is a refactored version of the original "Goose AI Agent Project": https://github.com/block/goose.

The layout started of from Vercel's "Turborepo Starter with Svelte": https://github.com/vercel/turborepo/tree/main/examples/with-svelte.

It transitions from a React frontend to a Svelte-based architecture while maintaining the Electron desktop application functionality.

The main entry point for the GD application is `desktop/goose-desktop/src/main/main.ts`, and the renderer process is `desktop/goose-desktop/src/renderer/index.html`. Run 'yarn start' from the root to start the application.

## Repository Structure

The codebase follows a monorepo approach with these main directories:

1. **apps/** - Contains various applications

   - docs/ - SvelteKit documentation app
   - shad_starter/ - Shadcn starter template
   - web/ - SvelteKit web application
   - all parent and child electron windows are from here

2. **packages/** - Shared libraries and configurations

   - ui/ - Shared Svelte component library (using shadcn-svelte)
   - typescript-config/ - TypeScript configuration
   - eslint-config/ - ESLint rules

3. **desktop/** - Desktop application

   - goose-desktop/ - Main Electron application being refactored

4. **goose-original/** - Original codebase serving as reference

5. **acumen/** - Project notes/documentation

## Development Guidelines

1. Use Yarn 4.6.0 for package management.
2. Use `tsx`(globally installed) directly in the terminal.
3. Use ESM modules and `import` statements instead of CommonJS and `require`, but Don't convert existing CommonJS files unless directed to do so. And, use `.mts` for ES modules and `.cts` for CommonJS.
4. All svelte apps are in the `apps` directory, build from base 'shadcs-svelte' components in the `packages/ui/shadcn` directory or basic svelte components in the `packages/ui/svelte` directory, or more complex components in the 'packages/ui/components' directory.
5. Use functional programming over OOP.
6. Prefer synchronous programming over asynchronous programming.
7. Don't change more code than absolutely required for the task at hand. Assume the other edits were intentional, don't undo them.
8. Follow the console.log format: `console.log(`Line ${line number} - ${file name} - '${var name}: `, var value)`
9. Refer to the original Goose project as a reference without modifying it.
10. Avoid generic file names, use descriptive file naming (e.g., api_types.ts instead of types.ts)

## TypeScript Type Organization

To ensure consistency and prevent duplication, types are organized in specific locations:

1. **Feature-Specific Types**: `/main/main_ipc/types/`

   - Organized by feature (e.g., `window.types.ts`, `browser.types.ts`)
   - Re-exported through `index.ts`

2. **Electron-Specific Types**: `/main/types/electron/`

   - Global type definitions affecting multiple parts of the application

3. **Generated Types**: `/api/generated/`

   - Auto-generated types (do not modify manually)

4. **SDK Types**: Within SDK directories
   - Types specific to SDKs stay with their SDK code

**Naming Conventions**:

- Type Files: Use `.types.ts` suffix for type definition files; `.d.ts` for declaration files
- Type Names: Use PascalCase with descriptive suffixes (Response, Options, Config)

**Best Practices**:

- Use type-only imports when possible: `import type { ... }`
- Import from the closest source to usage
- Check existing types before creating new ones to avoid duplication

For detailed guidelines, see: `desktop/goose-desktop/src/types_instructions.md`

## Technology Stack

- **Framework**: Electron for desktop, SvelteKit for UI
- **UI Components**: shadcn-svelte
- **Build System**: Turborepo for monorepo management, Vite for bundling
- **Package Manager**: Yarn 4.6.0
- **Languages**: TypeScript/JavaScript
- **Programming Paradigm**: Functional programming

## Third Party Documentation

- [Electron V34](https://www.electronjs.org/docs)
- [shadcn-svelte next](https://ui.shadcn.com/docs/installation/svelte)
- [Svelte V5](https://svelte.dev/docs/introduction)
- [SvelteKit V2](https://svelte.dev/docs/kit/introduction)
- Model Context Protocol (MCP) - [Docs](https://modelcontextprotocol.io/introduction) / [Specs](https://spec.modelcontextprotocol.io/specification/2024-11-05/)
- [Turborepo](https://turbo.build/repo/docs)

## Desktop Application Architecture

The desktop application "goose-desktop" (GD) is built with Electron and has:

- **Main Process**: Handles window management with a hierarchical structure (main window → parent windows → child windows)
- **Renderer Process**: Uses SvelteKit for the frontend UI
- **IPC Communication**: For communication between processes
- **Extensions**: Contains extension functionality based on MCP Servers
