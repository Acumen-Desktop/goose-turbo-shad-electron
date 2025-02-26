# Summary of Goose Desktop Application Logic (Main Process - `main.ts`)

This document provides a detailed summary of the core logic within the `main.ts` file of the Goose desktop application, as well as related frontend files `App.tsx`, `renderer.tsx`, and `preload.ts`. This file orchestrates the application's main process, managing windows, inter-process communication (IPC), the lifecycle of the application, goosed process, and more.

## Core Responsibilities of `main.ts`

1.  **Application Lifecycle Management:** Handles events related to application launch, window creation and closure, and quitting.
2.  **Window Management:** Creates, positions, and controls chat windows. Manages window focus and related keyboard shortcuts.
3.  **Inter-Process Communication (IPC):** Sets up channels for communication between the main process (`main.ts`) and the renderer process (React UI).
4.  **Goosed Integration:** Manages the lifecycle of the "goosed" process (Goose daemon), which is likely responsible for core AI functionality.
5.  **Deep Linking ("goose://"):** Handles custom protocol links (e.g., `goose://`) for extension installation.
6.  **Menu Customization:** Modifies the application's menu bar with custom options (e.g., "Environment," "Open Directory," "Recent Directories").
7.  **Tray Icon:** Creates and manages a system tray icon.
8.  **Error Handling:** Implements robust error handling for uncaught exceptions and unhandled promise rejections.
9. **Power Management**: Prevents the computer from going to sleep while the application is running.
10. **Ollama Integration:** Checks if the Ollama process is running on the user's machine.
11. **Extension Instillation:** Adds the ability to install extensions through a menu item.

## Logic Breakdown (`main.ts`)

### 1. Imports and Initial Setup

*   **Dependencies:** Imports necessary modules from Node.js (`child_process`, `path`) and Electron (`app`, `BrowserWindow`, etc.). Also imports external libraries like `dotenv` and `electron-squirrel-startup`.
*   **`dotenv/config`:** Loads environment variables from `.env`.
*   **`electron-squirrel-startup`:** Handles Squirrel installer behavior on Windows (quits immediately if launched by Squirrel).
*   **`app.setAsDefaultProtocolClient('goose')`:** Registers the application to handle "goose://" links.

### 2. Deep Linking (Extension Installation)

*   **`app.on('open-url', ...)`:** Handles "goose://" URL activation.
*   **`event.preventDefault()`:** Prevents browser window opening.
*   **Window Focus/Creation:** Finds an existing chat window, brings it to the front, or creates a new one.
*   **`targetWindow.webContents.send('add-extension', url)`:** Sends the "goose://" URL to the renderer process (UI) via IPC.

### 3. Environment Variables and Configuration

*   **`declare var ...`:** Type declarations for Vite-injected variables.
*   **`envToggles`:** Loads environment variable toggles from storage.
*   **`parseArgs()`:** Parses command-line arguments, especially `--dir`.
*   **`getGooseProvider()`:** Retrieves the Goose provider and model from environment variables, includes a build time variable injection.
*   **`generateSecretKey()`:** Generates a random secret key for security.
*   **`appConfig`:** Stores application configuration settings passed to the renderer.

### 4. `createChat()` Function (Core Window Creation)

*   **`createChat()`:** Main function for creating chat windows.
    *   **`updateEnvironmentVariables(envToggles)`:** Applies user settings for environment variables.
    *   **`startGoosed(app, dir)`:** Starts the "goosed" process in a specified directory. Returns port, working directory, and process object.
    *   **`new BrowserWindow(...)`:** Creates a new Electron `BrowserWindow`.
        *   **Styling:** Configures title bar, traffic lights, vibrancy, frame, etc.
        *   **Dimensions:** Sets width, height, minimum width, etc.
        *   **Icon:** Sets the application icon.
        *   **`webPreferences`:**
            *   **`preload`:** Path to `preload.js` (IPC bridge).
            *   **`additionalArguments`:** Passes `appConfig` and other settings.
            * **`partition`**: sets persistent webview data.
    *   **`mainWindow.webContents.setWindowOpenHandler(...)`:** Handles new window requests, forcing external links to open in the default browser.
    *   **Loading:**
        *   **Dev:** Loads from Vite dev server.
        *   **Prod:** Loads from built HTML (`index.html`).
    *   **`globalShortcut.register(...)`:** Registers shortcuts:
        *   `Alt+Command+I`: Open DevTools.
        *   `CommandOrControl+R`: Reload window.
    *   **`windowMap.set(...)`:** Tracks the new window using a unique ID.
    *   **`mainWindow.on('closed', ...)`:** Cleans up when the window closes (removes from `windowMap`, kills `goosedProcess`).
    * **Window Positioning**: uses a logic that alternates position and offset to avoid window overlap.
    *   **Returns `mainWindow`:** Returns the created `BrowserWindow`.

### 5. `createTray()` Function

*   **`createTray()`:** Creates a system tray icon.
    *   **Icon Path:** Determines the appropriate icon path for development vs. production.
    *   **Context Menu:** Creates a right-click menu ("Show Window," "Quit").
    *   **`tray.setToolTip('Goose')`:** Sets the tooltip text.
    * **`showWindow()`:** Opens all the open windows and focuses them.

### 6. `buildRecentFilesMenu()` and `openDirectoryDialog()`

*   **`buildRecentFilesMenu()`:** Builds a dynamic menu of recent directories:
    *   Loads recent directories using `loadRecentDirs()`.
    *   Creates a menu item for each directory to open a new chat window.
*   **`openDirectoryDialog()`:** Opens a directory picker:
    *   Uses `dialog.showOpenDialog()`.
    *   Adds the selected directory to the recent list (`addRecentDir()`).
    *   Optionally closes the focused window (`replaceWindow`).

### 7. Error Handling

*   **`handleFatalError()`:** Sends an error message to all renderer processes via IPC.
*   **`process.on('uncaughtException', ...)`:** Handles uncaught errors.
*   **`process.on('unhandledRejection', ...)`:** Handles unhandled promise rejections.

### 8. Inter-Process Communication (IPC) Handlers

*   **`ipcMain.handle(...)`:** Sets up handlers for requests from the renderer process.
    *   **`select-file-or-directory`:** Opens a file/directory selection dialog.
    *   **`check-ollama`:** checks if the ollama process is running.
    * **`start-power-save-blocker`**: Start the power save blocker.
    * **`stop-power-save-blocker`**: Stop the power save blocker.
    *   **`get-binary-path`:** Gets the path to a binary (e.g., `goosed`).
    *   **`fetch-metadata`:** Fetches metadata from a URL.
*   **`ipcMain.on(...)`:** Sets up handlers for events from the renderer.
    *   **`create-chat-window`:** Creates a new chat window.
    *   **`directory-chooser`:** Opens the directory dialog.
    *   **`notify`:** Displays a system notification.
    *   **`logInfo`:** Logs an info message from the renderer.
    *   **`reload-app`:** Restarts the application.
    * **`open-in-chrome`**: Open a url in chrome.

### 9. `app.whenReady().then(async () => { ... })` (Initialization)

*   **`app.whenReady().then(...)`:** The main initialization entry point (after Electron is ready).
* **`process.env.GOOSE_TEST_ERROR === 'true'`**: throws an error after 5 seconds if set.
*   **Command Line Arguments:** Parses command line arguments.
*   **`createTray()`:** Creates the system tray icon.
*   **Window Creation:** Creates the first chat window.
*   **Menu Customization:**
    *   Gets the existing menu (`Menu.getApplicationMenu()`).
    *   Adds "Environment" submenu to "View."
    *   Adds "Open Directory" and "Recent Directories" to "File."
    *   Adds "New Chat Window" to the file menu.
    * Adds a shortcut and dialog to install extensions.
    *   Sets the modified menu (`Menu.setApplicationMenu(menu)`).
*   **`app.on('activate', ...)`:** Creates a new window when the app is activated and no windows are open.

### 10. `app.on('window-all-closed', () => { ... })`

*   **`app.on('window-all-closed', ...)`:** Handles the event when all windows are closed.
*   **Quitting:** Quits the app if not on macOS. On macOS, the app typically stays running.

## Additional Frontend Files:

### `App.tsx` (React Entry Point)

*   **View Management:** Uses state (`view`, `viewOptions`) to control which view (welcome, chat, settings, etc.) is displayed.
*   **Extension Installation Handling:** Listens for the `add-extension` IPC event and displays a modal to confirm the installation.
*   **Keyboard Shortcut:** Listens for `CmdOrCtrl+N` to create a new chat window.
*   **Provider Initialization:** Uses `getStoredProvider` and `initializeSystem` to try to automatically set up the configured provider.
*   **Fatal Error Handling:** Listens for `fatal-error` IPC events and displays an error screen.
*   **Confirmation Modal:** Manages a confirmation modal for extension installations.
* **UI**: Manages the different app states.

### `renderer.tsx` (React Renderer)

*   **React Entry:** Renders the root `App` component.
*   **Context Providers:** Sets up context providers for `ModelProvider`, `ActiveKeysProvider`, and `ErrorBoundary`.
*   **Patch Console Logging:** sets up custom logging.

### `preload.ts` (IPC Bridge)

*   **Context Bridge:** Sets up the communication bridge between the main process and the renderer process.
*   **`window.electron`:** Exposes methods to the renderer process for interacting with the main process (e.g., `getConfig`, `createChatWindow`, `logInfo`, `on`, `off`, `emit`).
*   **`window.appConfig`:** Exposes configuration settings from the main process to the renderer.
*   **Defines types** for better type management.

## Conclusion

The `main.ts` file and the frontend components form the foundation of the Goose desktop application. `main.ts` manages the low level operating system interaction and overall application logic. `preload.ts` bridges the gap between the OS and the react code. `App.tsx` manages the view of the react application and `renderer.tsx` is the entrypoint for the react component rendering. The files work in tandem to create a functional AI chat application.
