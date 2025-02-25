# Goose Desktop Source Code Guide

This document serves as an entry point for understanding the organization and documentation of the Goose Desktop application source code.

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