export const createChat = async (app, query?: string, dir?: string, version?: string) => {
    console.log('Line 52 createChat:')
//   updateEnvironmentVariables(envToggles);
//   const [port, working_dir, goosedProcess] = await startGoosed(app, dir);

//   const mainWindow = new BrowserWindow({
//     titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
//     trafficLightPosition: process.platform === 'darwin' ? { x: 16, y: 10 } : undefined,
//     vibrancy: process.platform === 'darwin' ? 'window' : undefined,
//     frame: process.platform === 'darwin' ? false : true,
//     width: 750,
//     height: 800,
//     minWidth: 650,
//     resizable: true,
//     transparent: false,
//     useContentSize: true,
//     icon: path.join(__dirname, '../images/icon'),
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       additionalArguments: [
//         JSON.stringify({
//           GOOSE_PORT: port,
//           GOOSE_WORKING_DIR: working_dir,
//           REQUEST_DIR: dir,
//         }),
//       ],
//       partition: 'persist:goose',
//     },
//   });

//   mainWindow.webContents.setWindowOpenHandler(({ url }) => {
//     if (url.startsWith('http:') || url.startsWith('https:')) {
//       require('electron').shell.openExternal(url);
//       return { action: 'deny' };
//     }
//     return { action: 'allow' };
//   });

//   const queryParam = query ? `?initialQuery=${encodeURIComponent(query)}` : '';
//   const primaryDisplay = electron.screen.getPrimaryDisplay();
//   const { width } = primaryDisplay.workAreaSize;

//   const windowId = ++windowCounter;
//   const direction = windowId % 2 === 0 ? 1 : -1;
//   const initialOffset = 50;
//   const baseXPosition = Math.round(width / 2 - mainWindow.getSize()[0] / 2);
//   const xOffset = direction * initialOffset * Math.floor(windowId / 2);
//   mainWindow.setPosition(baseXPosition + xOffset, 100);

//   if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
//     mainWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}${queryParam}`);
//   } else {
//     const indexPath = path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
//     mainWindow.loadFile(indexPath, {
//       search: queryParam ? queryParam.slice(1) : undefined,
//     });
//   }

//   const registerDevToolsShortcut = (window: BrowserWindow) => {
//     globalShortcut.register('Alt+Command+I', () => {
//       window.webContents.openDevTools();
//     });
//   };

//   const unregisterDevToolsShortcut = () => {
//     globalShortcut.unregister('Alt+Command+I');
//   };

//   mainWindow.on('focus', () => {
//     registerDevToolsShortcut(mainWindow);
//     globalShortcut.register('CommandOrControl+R', () => {
//       mainWindow.reload();
//     });
//   });

//   mainWindow.on('blur', () => {
//     unregisterDevToolsShortcut();
//     globalShortcut.unregister('CommandOrControl+R');
//   });

//   windowMap.set(windowId, mainWindow);
//   mainWindow.on('closed', () => {
//     windowMap.delete(windowId);
//     unregisterDevToolsShortcut();
//     goosedProcess.kill();
//   });
//   return mainWindow;
};