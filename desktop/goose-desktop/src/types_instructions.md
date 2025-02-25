# TypeScript Type Organization Guide

This document provides guidelines for organizing and managing TypeScript types in the Goose Desktop application.

## Core Principles

1. **Proximity to Implementation**: Types should be located close to where they are primarily used
2. **Clear Separation**: Different categories of types should have distinct locations
3. **Avoid Duplication**: Types should be defined once and imported where needed
4. **Intuitive Naming**: Type files should have clear, descriptive names

## Type Locations

### 1. Feature-Specific Types
Location: `/main/main_ipc/types/`
- Types specific to IPC communication are organized by feature
- Each feature has its own file (e.g., window.types.ts, browser.types.ts)
- All types are re-exported through index.ts
- Example: `NotificationData` in window.types.ts

### 2. Electron-Specific Types
Location: `/main/types/electron/`
- Types related to Electron functionality
- Global type definitions that affect multiple parts of the application
- Example: electron-api.d.ts defines the ElectronAPI interface

### 3. Generated Types
Location: `/api/generated/`
- Auto-generated types stay in their generation directory
- Should not be manually modified
- Example: types.gen.ts from OpenAPI spec

### 4. SDK Types
Location: Within SDK directories
- Types specific to SDKs stay with their SDK code
- Example: /ai-sdk-fork/core/types/usage.ts

## Naming Conventions

1. **Type Files**
   - Use `.types.ts` suffix for type definition files
   - Use `.d.ts` suffix for declaration files
   - Example: `window.types.ts`, `electron-api.d.ts`

2. **Type Names**
   - Use PascalCase for type/interface names
   - Add descriptive suffixes like Response, Options, Config
   - Example: `NotificationData`, `ChatWindowOptions`

## Best Practices

1. **Exports**
   - Use named exports for types
   - Create index.ts files to re-export types from feature directories
   - Export commonly used types explicitly for better discoverability

2. **Imports**
   - Import types from the closest source
   - Use type-only imports when possible: `import type { ... }`
   - Prefer importing from index files over direct file imports

3. **Organization**
   - Group related types in the same file
   - Add clear comments to describe type purposes
   - Include type guards for runtime validation

4. **Maintenance**
   - Keep type definitions up to date with implementations
   - Remove unused types
   - Document breaking changes in type definitions

## Common Issues to Avoid

1. **Type Duplication**
   - Don't define the same type in multiple places
   - Use imports to share types across files

2. **Incorrect Locations**
   - Don't put feature-specific types in global locations
   - Keep types close to their primary usage

3. **Missing Exports**
   - Ensure all types are properly exported
   - Check index.ts files include all necessary exports

4. **Inconsistent Naming**
   - Follow the established naming conventions
   - Use clear, descriptive names

## Questions to Ask

When adding new types, ask:
1. Is this type specific to a feature?
2. Where is this type primarily used?
3. Could this type be useful in other parts of the application?
4. Does a similar type already exist?

## Need Help?

If you're unsure about where to place types or how to organize them:
1. Check this guide first
2. Look at existing similar types
3. Ask for guidance in code reviews