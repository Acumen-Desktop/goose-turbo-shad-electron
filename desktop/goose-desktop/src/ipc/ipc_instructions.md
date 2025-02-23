# Electron IPC Structure Guide

## Quick Reference

### Key Files
- **Channel Definitions**: `shared/ipc-channels.ts` - Single source of truth for all IPC channels
- **Shared Types**: `shared/types.ts` - Only when types add real value

### Common Patterns (with line examples)
- Need response from main? → `renderer-invoke-main/*.invoker.ts` [Line 180]
- Just sending to main? → `renderer-send-messages/*.sender.ts` [Line 220]
- Handle renderer requests? → `main-handle-requests/*.handler.ts` [Line 140]
- Listen for renderer messages? → `main-event-listeners/*.listener.ts` [Line 160]
- Send to renderer? → `main-send-messages/*.sender.ts` [Line 200]
- Listen in renderer? → `renderer-event-listeners/*.listener.ts` [Line 240]

### Anti-Duplication Steps
1. Check `ipc-channels.ts` for existing channel
2. Search matching pattern directory (e.g., all handlers in `main-handle-requests/`)
3. Extend existing file if similar functionality exists
4. Only create new file if truly unique functionality

## Detailed Guide

### Decision Tree for IPC Implementation

Before creating a new IPC file, follow this decision process:

1. **Which process owns this code?**
   - Running in main process → Use `/main/` directory
   - Running in renderer process → Use `/renderer/` directory

2. **What IPC pattern do I need?**
   - Need a response back? 
     - From main: Use `main-handle-requests/` (pairs with `renderer-invoke-main/`)
     - From renderer: Use `renderer-invoke-main/` (pairs with `main-handle-requests/`)
   - Just sending data one-way? 
     - From main: Use `main-send-messages/` (pairs with `renderer-event-listeners/`)
     - From renderer: Use `renderer-send-messages/` (pairs with `main-event-listeners/`)
   - Need synchronous response? 
     - Only available in renderer: Use `renderer-sync-calls/` (use sparingly!)

3. **Before creating a new file:**
   - Check the appropriate pattern directory for existing similar functionality
   - Look for files with similar purpose or naming
   - Consider extending an existing file instead of creating a new one
   - Use clear, feature-specific naming to help others find your code

### File Naming Convention
- `*.handler.ts` - Main process request handlers (ipcMain.handle)
- `*.listener.ts` - Event listeners (ipcMain.on/ipcRenderer.on)
- `*.sender.ts` - Message senders (webContents.send/ipcRenderer.send)
- `*.invoker.ts` - Renderer invoke calls (ipcRenderer.invoke)
- `*.caller.ts` - Sync operations (ipcRenderer.sendSync)

### IPC Patterns with Examples

### 1. Request-Response (Recommended)
```typescript
// shared/ipc-channels.ts
export const IPC = {
  USER: {
    LOGIN: 'user:login',
    FETCH_PROFILE: 'user:fetch-profile'
  }
} as const;

// main-handle-requests/user-auth.handler.ts
import { ipcMain } from 'electron';
import { IPC } from '../shared/ipc-channels';

ipcMain.handle(IPC.USER.LOGIN, async (event, credentials: { username: string; password: string }) => {
  try {
    const user = await authService.login(credentials);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// renderer-invoke-main/user-auth.invoker.ts
import { ipcRenderer } from 'electron';
import { IPC } from '../shared/ipc-channels';

export async function login(username: string, password: string) {
  return await ipcRenderer.invoke(IPC.USER.LOGIN, { username, password });
}
```

### 2. One-way Events (For notifications/updates)
```typescript
// main-send-messages/notification.sender.ts
import { BrowserWindow } from 'electron';
import { IPC } from '../shared/ipc-channels';

export function broadcastNotification(message: string) {
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send(IPC.NOTIFICATION.NEW, { message, timestamp: Date.now() });
  });
}

// renderer-event-listeners/notification.listener.ts
import { ipcRenderer } from 'electron';
import { IPC } from '../shared/ipc-channels';

ipcRenderer.on(IPC.NOTIFICATION.NEW, (event, data) => {
  showNotification(data.message);
});
```

### 3. Event Listeners (For window/app lifecycle)
```typescript
// main-event-listeners/window-state.listener.ts
import { ipcMain, BrowserWindow } from 'electron';
import { IPC } from '../shared/ipc-channels';

ipcMain.on(IPC.WINDOW.MINIMIZE, (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win?.minimize();
});

// renderer-send-messages/window-control.sender.ts
import { ipcRenderer } from 'electron';
import { IPC } from '../shared/ipc-channels';

export function minimizeWindow() {
  ipcRenderer.send(IPC.WINDOW.MINIMIZE);
}
```

### 4. Sync Calls (Use sparingly!)
```typescript
// renderer-sync-calls/app-config.caller.ts
import { ipcRenderer } from 'electron';
import { IPC } from '../shared/ipc-channels';

// Only use sync for critical startup configuration
export function getInitialConfig() {
  return ipcRenderer.sendSync(IPC.CONFIG.GET_INITIAL);
}

// main-event-listeners/app-config.listener.ts
ipcMain.on(IPC.CONFIG.GET_INITIAL, (event) => {
  event.returnValue = {
    theme: store.get('theme'),
    locale: store.get('locale')
  };
});
```

### Implementation Examples

#### 1. Request-Response Pattern (Recommended)
```typescript
// shared/ipc-channels.ts
export const IPC = {
  USER: {
    LOGIN: 'user:login'
  }
} as const;

// main-handle-requests/auth.handler.ts
ipcMain.handle(IPC.USER.LOGIN, async (event, credentials) => {
  try {
    return await authService.login(credentials);
  } catch (error) {
    log.error('Login failed:', error);
    return { success: false, error: error.message };
  }
});

// renderer-invoke-main/auth.invoker.ts
export async function login(credentials: Credentials) {
  return await ipcRenderer.invoke(IPC.USER.LOGIN, credentials);
}
```

#### 2. One-way Events Pattern
```typescript
// main-send-messages/notification.sender.ts
export function broadcastNotification(message: string) {
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send(IPC.NOTIFICATION.NEW, message);
  });
}

// renderer-event-listeners/notification.listener.ts
export function onNotification(callback: (message: string) => void) {
  const handler = (_: any, message: string) => callback(message);
  ipcRenderer.on(IPC.NOTIFICATION.NEW, handler);
  return () => ipcRenderer.off(IPC.NOTIFICATION.NEW, handler);
}
```

### Best Practices
1. Always use `ipc-channels.ts` constants
2. Add error handling and logging
3. Return cleanup function from listeners
4. Keep files small and focused
5. Use TypeScript for function parameters
6. Group related IPC calls in same file
7. Comment complex business logic

### Anti-Duplication Strategy
- Each IPC pattern folder represents a specific communication type
- All files in a folder use the same IPC pattern, making it easy to find similar functionality
- Before adding new IPC code, scan the relevant pattern folder for existing solutions
- If similar functionality exists, extend it rather than creating a new file
- Use descriptive file names that indicate the feature's purpose

### Common Gotchas
1. Don't use sync calls except for startup
2. Check if window exists before sending
3. Clean up listeners to prevent memory leaks
4. Handle errors in both processes
5. Don't pass sensitive data through IPC