import { IpcRendererEvent } from 'electron';

export interface ElectronAPI {
  // Config and window management
  getConfig: () => Record<string, any>;
  hideWindow: () => void;
  createChatWindow: (query?: string, dir?: string, version?: string) => void;
  reloadApp: () => void;

  // Logging and notifications
  logInfo: (txt: string) => void;
  showNotification: (data: any) => void;

  // Browser and metadata
  openInChrome: (url: string) => void;
  fetchMetadata: (url: string) => Promise<any>;

  // System checks
  checkForOllama: () => Promise<boolean>;
  getBinaryPath: (binaryName: string) => Promise<string>;

  // File system operations
  selectFileOrDirectory: () => Promise<string | null>;
  directoryChooser: () => Promise<string | null>;

  // Power management
  startPowerSaveBlocker: () => Promise<number>;
  stopPowerSaveBlocker: () => Promise<void>;

  // Goosed management
  startGoosed: () => Promise<{ port?: number; error?: string }>;
  stopGoosed: (port: number) => Promise<{ isRunning: boolean; error?: string }>;
  checkGoosed: () => Promise<{ isRunning: boolean; port?: number }>;

  // Event handling
  on: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => void;
  off: (
    channel: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => void;
  emit: (channel: string, ...args: any[]) => void;
}

export interface AppConfigAPI {
  get: (key: string) => any;
  getAll: () => Record<string, any>;
}

export interface TestAPI {
  sendPing: () => Promise<{ timestamp: string; message: string }>;
}

declare global {
  interface Window {
    electronApi: ElectronAPI;
    appConfigApi: AppConfigAPI;
    testApi: TestAPI;
  }
}