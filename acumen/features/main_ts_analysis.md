# Main.ts Analysis Checklist

## Imports and Dependencies
- [ ] Core Node.js modules
  - [ ] child_process (spawn, exec)
  - [ ] path
  - [ ] crypto
  - [ ] util (promisify)
- [ ] Electron modules
  - [ ] app, BrowserWindow, dialog, globalShortcut
  - [ ] ipcMain, Menu, MenuItem, Notification
  - [ ] powerSaveBlocker, Tray
- [ ] Third-party modules
  - [ ] dotenv/config
  - [ ] electron-squirrel-startup
- [ ] Local modules
  - [ ] startGoosed from './goosed'
  - [ ] getBinaryPath from './utils/binaryPath'
  - [ ] loadShellEnv from './utils/loadEnv'
  - [ ] logger from './utils/logger'
  - [ ] recentDirs utils from './utils/recentDirs'
  - [ ] settings utils from './utils/settings'

## Application Configuration
- [ ] Protocol Registration
  - [ ] Sets 'goose' as default protocol client
- [ ] Environment Configuration
  - [ ] Loads shell environment
  - [ ] Generates secret key
  - [ ] Configures provider and model
- [ ] App Configuration Object
  - [ ] GOOSE_PROVIDER
  - [ ] GOOSE_MODEL
  - [ ] GOOSE_API_HOST
  - [ ] GOOSE_PORT
  - [ ] GOOSE_WORKING_DIR
  - [ ] secretKey

## Window Management
- [ ] Window Creation (createChat function)
  - [ ] Platform-specific window settings
  - [ ] Window positioning logic
  - [ ] Preload script configuration
  - [ ] Development/Production path handling
- [ ] Window Tracking
  - [ ] Window counter implementation
  - [ ] Window map management
- [ ] Window Event Handlers
  - [ ] External link handling
  - [ ] DevTools shortcuts
  - [ ] Window focus/blur events
  - [ ] Window closure cleanup

## IPC Communication Handlers
- [ ] File Operations
  - [ ] select-file-or-directory
  - [ ] directory-chooser
- [ ] System Operations
  - [ ] check-ollama
  - [ ] get-binary-path
  - [ ] fetch-metadata
- [ ] Window Management
  - [ ] create-chat-window
  - [ ] reload-app
- [ ] Notifications
  - [ ] notify
  - [ ] logInfo
- [ ] Power Management
  - [ ] start-power-save-blocker
  - [ ] stop-power-save-blocker

## System Tray Integration
- [ ] Tray Creation
  - [ ] Icon handling
  - [ ] Context menu setup
- [ ] Tray Menu Actions
  - [ ] Show window
  - [ ] Quit application

## Menu System
- [ ] File Menu
  - [ ] Open Directory
  - [ ] Recent Directories
  - [ ] New Chat Window
- [ ] View Menu
  - [ ] Environment submenu
  - [ ] Environment toggle handling
- [ ] Keyboard Shortcuts
  - [ ] CmdOrCtrl+O for directory opening
  - [ ] CmdOrCtrl+N for new window
  - [ ] Shift+Command+Y for extension installation

## Error Handling
- [ ] Global Error Handlers
  - [ ] uncaughtException
  - [ ] unhandledRejection
- [ ] Fatal Error Management
  - [ ] Error broadcasting to windows
  - [ ] Error logging

## Platform-Specific Code
- [ ] macOS Specific
  - [ ] Window titlebar styling
  - [ ] Traffic light positioning
  - [ ] Window vibrancy
  - [ ] Chrome opening command
- [ ] Windows Specific
  - [ ] Window frame handling
  - [ ] Chrome opening command
- [ ] Linux Specific
  - [ ] xdg-open handling

## Integration Points
- [ ] Goosed Process
  - [ ] Process startup
  - [ ] Port management
  - [ ] Working directory setup
- [ ] Extension System
  - [ ] URL handling
  - [ ] Extension installation dialog
  - [ ] Extension metadata fetching

# Refactoring Suggestions

To refactor main.ts without React, consider the following approach:

1. **Replace React with Native Web Components**
   - [ ] Create custom elements for UI components
   - [ ] Use Shadow DOM for encapsulation
   - [ ] Implement native event handling

2. **Modular Architecture**
   - [ ] Split into smaller, focused modules:
     - [ ] WindowManager
     - [ ] TrayManager
     - [ ] MenuManager
     - [ ] IPCManager
     - [ ] ConfigManager

3. **State Management**
   - [ ] Implement pub/sub pattern for state changes
   - [ ] Use CustomEvents for component communication
   - [ ] Create a central state store

4. **UI Updates**
   - [ ] Use template literals for HTML generation
   - [ ] Implement data binding with Proxy objects
   - [ ] Use CSS custom properties for theming

5. **Event Handling**
   - [ ] Use event delegation
   - [ ] Implement custom event bus
   - [ ] Create declarative event bindings

Example Implementation Structure:
```typescript
// window-manager.ts
class WindowManager {
  private windows: Map<number, BrowserWindow>;
  
  createWindow() {
    // Window creation logic
  }
  
  handleWindowEvents() {
    // Event handling
  }
}

// tray-manager.ts
class TrayManager {
  private tray: Tray;
  
  initialize() {
    // Tray setup
  }
}

// menu-manager.ts
class MenuManager {
  buildMenus() {
    // Menu creation
  }
}

// main.ts
class Application {
  private windowManager: WindowManager;
  private trayManager: TrayManager;
  private menuManager: MenuManager;
  
  async initialize() {
    // Initialization logic
  }
}
```

This refactoring approach:
- Eliminates React dependencies
- Improves maintainability through modularization
- Reduces complexity with native web technologies
- Maintains existing functionality
- Improves performance with native components