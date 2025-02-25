# IPC Quick Reference

## Core IPC Commands (GO Version)
```typescript
// Most frequently used
getConfig: () => Record<string, any>
hideWindow: () => void
createChatWindow: (query?: string, dir?: string, version?: string) => void
directoryChooser: (replace: string) => void  // IMPORTANT: requires replace param
selectFileOrDirectory: () => Promise<string | null>

// System operations
reloadApp: () => void
checkForOllama: () => Promise<boolean>
getBinaryPath: (binaryName: string) => Promise<string>
startPowerSaveBlocker: () => Promise<number>
stopPowerSaveBlocker: () => Promise<void>

// Notifications & Browser
logInfo: (txt: string) => void
showNotification: (data: NotificationData) => void
openInChrome: (url: string) => void
fetchMetadata: (url: string) => Promise<MetadataResponse>

// Event handling
on/off/emit: Standard Electron IPC events
```

## Implementation Pattern

### 1. Channel Definition (ipc-channels.ts)
```typescript
export const IPC = {
  WINDOW: {
    HIDE: 'hide-window',
    CREATE_CHAT: 'create-chat-window',
  },
  FILE_SYSTEM: {
    CHOOSE_DIRECTORY: 'directory-chooser',
    SELECT: 'select-file-or-directory',
  },
  // ... other categories
};
```

### 2. Type Safety (types.ts)
```typescript
// Handler types
IPCMainHandler<P, R>  // For invoke operations
IPCMainListener<P>    // For send operations
IPCRendererListener<P>  // For renderer listeners

// Channel types
IPCChannelTypes {
  'channel-name': {
    params: ParamType;
    returns: ReturnType;
  }
}
```

### 3. Handler Registration (index.ts)
```typescript
export const ipcMainCode = {
  handlers: {
    browser: () => registerBrowserHandlers(),
    fileSystem: () => registerFileSystemHandlers(),
    system: (app: Electron.App) => registerSystemHandlers(app)
  },
  // ... listeners and messages
};
```

## Important Notes

1. Cleanup Pattern
```typescript
// Always return cleanup function from handlers/listeners
export function registerHandler(): () => void {
  ipcMain.handle(channel, handler);
  return () => ipcMain.removeHandler(channel);
}
```

2. Critical Differences from GO
- directoryChooser requires 'replace' parameter
- All handlers must provide cleanup functions
- Type validation is enforced

3. Type Validation
```typescript
// Runtime type checking
validateChannel<T extends IPCChannelName>(
  channel: T,
  params?: unknown
): params is IPCParams<T>
```

4. Additional GD Features
- Goosed operations (start/stop/check)
- Test API (ping)
- Enhanced error handling
- Type-safe channel organization

## File Organization
```
main_ipc/
  ├── index.ts           # Central registration
  ├── ipc-channels.ts    # Channel definitions
  ├── types.ts           # Type definitions
  ├── main-handle-requests/
  │   └── *.handler.ts   # Invoke handlers
  └── main-event-listeners/
      └── *.listener.ts  # Event listeners
```

## Common Patterns

1. Handler Implementation
```typescript
const handler: IPCMainHandler<string, void> = async (event, param) => {
  // Validation
  if (!validateChannel(channel, param)) throw new Error();
  // Implementation
  // Return result
};
```

2. Listener Implementation
```typescript
const listener: IPCMainListener<string> = (event, param) => {
  try {
    // Implementation
  } catch (error) {
    log.error('Error:', error);
  }
};
```

3. Error Handling
```typescript
try {
  // Implementation
} catch (error) {
  log.error('Error:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

## Testing
- Use TestAPI.sendPing() to verify IPC communication
- All handlers should be tested with invalid parameters
- Verify cleanup functions are called on window close