// Re-export all types from feature-specific files
export * from './window.types';
export * from './browser.types';
export * from './system.types';
export * from './filesystem.types';
export * from './extension.types';
export * from './channels.types';

// Re-export specific types that are commonly used
export type {
  // Window types
  NotificationData,
  ChatWindowOptions,
} from './window.types';

export type {
  // Browser types
  Metadata,
  MetadataResponse,
} from './browser.types';

export type {
  // System types
  GoosedStatus,
  GoosedStartResponse,
  GoosedStopResponse,
  GoosedCheckResponse,
  BinaryPathResponse,
  PowerSaveBlockerResponse,
} from './system.types';

export type {
  // File system types
  DirectoryChooserOptions,
  FileSystemResponse,
} from './filesystem.types';

export type {
  // Extension types
  ExtensionInstallOptions,
  ExtensionResponse,
} from './extension.types';