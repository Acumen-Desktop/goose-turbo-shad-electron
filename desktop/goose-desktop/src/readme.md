# Goose Desktop Source Code Guide

We are working on refactoring the original 'goose ai agent project', which we will refer to a "GO" and it's source code is located in this folder: 'goose-original/ui/desktop'. Use GO as the 'source of truth', do not edit it. The orignal GO has a React frontend which we are refactoring into separate frontend (svelte), backend and ai folders.

Our new version of 'goose ai' is located in this folder: 'desktop/goose-desktop' (GD). The 'main.ts' file is here: 'desktop/goose-desktop/src/main/main.ts'. And the main renderer html file is here: 'desktop/goose-desktop/src/renderer/index.html'.

Our electron window system will be to always have a master 'mainWindow' which will create and manage 'parent' windows, which will create and manage 'child' windows. The parents and children will use sveltekit frontends from here: 'apps'.

All our shared svelte components are in this folder: 'packages/ui' and mainly use 'shadcn-svelte'.

Our notes are in this folder: 'acumen'.

Before making edits or changing/adding/deleting files, check GO for code and logic, then check our modified folder structure. If you are not 100% sure, ask for help.

Use functional programming instead of OOP. Use Yarn in the terminal. Use 'tsx' in the terminal as it is installed globally.

## Documentation Files

The following markdown files provide detailed guidance on specific aspects of the codebase:

1. [Types Organization](./types_instructions.md)
   - Guidelines for TypeScript type organization
   - Type location conventions
   - Best practices for type management

2. [IPC Reference](./main/main_ipc/IPC_REFERENCE.md)
   - Documentation for IPC communication
   - Channel definitions and usage
   - Event handling patterns

## Directory Structure

```
src/
├── main/               # Main process code
│   ├── main_ipc/      # IPC communication
│   ├── types/         # Electron-specific types
│   └── ...
├── renderer/          # Renderer process code
├── api/               # API integration
├── utils/            # Shared utilities
└── types_instructions.md
```

## Important Notes

1. **Documentation Updates**
   - When adding new markdown documentation files, update this readme
   - Keep the list of documentation files current
   - Include a brief description of each documentation file

2. **Code Organization**
   - Each major feature should have its own directory
   - Keep related code together
   - Follow the type organization guidelines

3. **Type Safety**
   - Use TypeScript types consistently
   - Follow the type organization guide
   - Maintain type definitions alongside implementations

## Getting Started

1. Read this readme first
2. Review the types_instructions.md for type management
3. Check IPC_REFERENCE.md for communication patterns
4. Look for additional .md files in feature directories

## Maintenance

This readme should be kept up to date with:
- New documentation files
- Major structural changes
- Important conventions
- Best practices

Remember to check for and read any new documentation files that may have been added since your last session.