# Error Resolution Plan for @goose/desktop

## Overview
The @goose/desktop package is transitioning from React to Svelte. This document outlines the current TypeScript/ESLint errors and a plan to address them.

## Error Categories

### 1. React to Svelte Migration (Defer)
These errors are from React components that will be replaced with Svelte:

- ConfigManager.tsx JSX errors
  ```
  src/config/ConfigManager.tsx - Multiple JSX and type errors
  ```
  Plan: This component will be rewritten in Svelte. Temporarily comment out or move to a legacy folder.

- React-specific imports
  ```
  Cannot find module 'react-toastify'
  ```
  Plan: Replace with Svelte toast notifications when implementing the Svelte UI.

### 2. Missing Module Errors (Investigate)
Some imports reference files that may need to be migrated or recreated:

```typescript
Cannot find module './App'
Cannot find module './components/settings/SettingsView'
Cannot find module '../../../main/chat'
Cannot find module '../../../main/directory'
Cannot find module '../../ipc_OLD/handlers/goosed_OLD'
```

Plan:
1. Review each missing module
2. Determine if they should be:
   - Recreated in Svelte
   - Moved to a new location
   - Removed if functionality is no longer needed

### 3. TypeScript Configuration (Fix Now)
Current issues in the TypeScript setup:

- Implicit 'any' types in various files
- Missing return types on functions
- Unused variables

Plan:
1. Add explicit types for function parameters
2. Add return type annotations
3. Remove or use commented variables
4. Consider enabling strict mode in tsconfig.json gradually

### 4. Electron Main Process Issues (Fix Now)

#### Main Process Code
In src/main/main.ts and related files:
```typescript
- Condition will always return true (squirrel-startup)
- Missing type declarations for electron-specific globals
```

Plan:
1. Fix the squirrel-startup condition check
2. Add proper type declarations for Electron globals
3. Clean up unused imports and variables

#### IPC Related
Several IPC handlers and listeners have type issues:
```typescript
src/main/main_ipc/* - Various type and import errors
```

Plan:
1. Fix type declarations for IPC channels
2. Update handler signatures with proper types
3. Clean up old IPC code references

## Implementation Priority

1. **Immediate Fixes**
   - Electron main process type issues
   - Critical TypeScript errors in non-UI code
   - IPC type declarations

2. **Investigation Required**
   - Missing module imports
   - Determine which old modules need migration

3. **Defer for Migration**
   - All React component related errors
   - React-specific dependencies and imports
   - Old UI code that will be replaced with Svelte

## Questions for Discussion

1. Should we maintain a temporary "legacy" folder for React components during migration?
2. Which features from the React version need to be reimplemented in Svelte?
3. Should we implement strict TypeScript checking gradually or all at once?
4. Are there any React components that should be prioritized for migration to Svelte?

## Next Steps

1. Create a migration tracking system (e.g., spreadsheet or project board)
2. Set up a parallel Svelte structure while keeping React code
3. Implement new features directly in Svelte
4. Gradually migrate existing features from React to Svelte
5. Remove React code once features are verified in Svelte