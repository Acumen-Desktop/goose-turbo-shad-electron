# File System Handlers Implementation Plan

## Overview
This plan outlines the implementation of file system handlers for the Electron app, specifically focusing on the SELECT and CHOOSE_DIRECTORY IPC channels.

Add simple UI to 'desktop/goose-desktop/src/renderer/index.html' to test the functionality of the file system handlers.

## Implementation Steps

### 1. File System Handler Implementation
- Implement SELECT handler using dialog.showOpenDialog with both file and directory options
- Implement CHOOSE_DIRECTORY handler using dialog.showOpenDialog with directory-only option
- Add proper cleanup function to remove handlers when app closes
- Ensure proper TypeScript types and error handling

### 2. Main Process Updates
- Uncomment the fileSystem handler registration in main.ts
- Ensure proper cleanup when window closes

### 3. Testing Considerations
- Test both handlers with proper error handling
- Verify cleanup functions work correctly
- Ensure proper type safety throughout

### 4. Documentation
- Add comments explaining the handlers' functionality
- Document the expected input/output formats
- Note any limitations or special cases

## Files to Modify
- desktop/goose-desktop/src/main/main_ipc/main-handle-requests/file-system.handler.ts
- desktop/goose-desktop/src/main/main.ts

## IPC Channels
```typescript
FILE_SYSTEM: {
  CHOOSE_DIRECTORY: 'directory-chooser',
  SELECT: 'select-file-or-directory',
}
```

## Expected Behavior
- SELECT: Opens dialog for selecting either files or directories
- CHOOSE_DIRECTORY: Opens dialog for selecting directories only
- Both handlers should provide proper error handling and cleanup