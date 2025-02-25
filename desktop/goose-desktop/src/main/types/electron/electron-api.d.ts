import { IpcRendererEvent } from 'electron';
import {
  NotificationData,
  MetadataResponse,
  GoosedStartResponse,
  GoosedStopResponse,
  GoosedCheckResponse,
  FileSystemResponse
} from '../ipc/types';

export interface ElectronAPI {
  // Config and window management
  getConfig: () => Record<string, any>;
  hideWindow: () => void;
  createChatWindow: (query?: string, dir?: string, version?: string) => void;
  reloadApp: () => void;

  // Logging and notifications
  logInfo: (txt: string) => void;
  showNotification: (data: NotificationData) => void;

  // Browser and metadata
  openInChrome: (url: string) => void;
  fetchMetadata: (url: string) => Promise<MetadataResponse>;

  // System checks
  checkForOllama: () => Promise<boolean>;
  getBinaryPath: (binaryName: string) => Promise<string>;

  // File system operations
  selectFileOrDirectory: () => Promise<string | null>;
  directoryChooser: (replace: string) => void;

  // Power management
  startPowerSaveBlocker: () => Promise<number>;
  stopPowerSaveBlocker: () => Promise<void>;

  // Goosed management
  startGoosed: () => Promise<GoosedStartResponse>;
  stopGoosed: (port: number) => Promise<GoosedStopResponse>;
  checkGoosed: () => Promise<GoosedCheckResponse>;

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