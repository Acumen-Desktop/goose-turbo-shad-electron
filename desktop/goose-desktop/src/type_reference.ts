/**
 * Type Reference File
 *
 * This file imports and re-exports common types from across the project
 * to make them easier to discover for AI assistants.
 *
 * This file is NOT meant to be imported in actual code - it's a reference only.
 */

// IPC Types
import type * as BrowserTypes from './main/main_ipc/types/browser.types';
import type * as ChannelTypes from './main/main_ipc/types/channels.types';
import type * as ExtensionTypes from './main/main_ipc/types/extension.types';
import type * as FileSystemTypes from './main/main_ipc/types/filesystem.types';
import type * as SystemTypes from './main/main_ipc/types/system.types';
import type * as WindowTypes from './main/main_ipc/types/window.types';

// Re-export all types
export { WindowTypes, BrowserTypes, FileSystemTypes, SystemTypes, ExtensionTypes, ChannelTypes };

/**
 * Common Type Usage Examples:
 *
 * Window Types:
 * - WindowTypes.NotificationData - For sending notifications
 * - WindowTypes.WindowOptions - For configuring new windows
 *
 * Browser Types:
 * - BrowserTypes.BrowserViewOptions - For browser view configuration
 *
 * FileSystem Types:
 * - FileSystemTypes.FileOperationResult - For file operation results
 *
 * System Types:
 * - SystemTypes.SystemInfo - For system information
 *
 * Extension Types:
 * - ExtensionTypes.ExtensionConfig - For extension configuration
 *
 * Channel Types:
 * - ChannelTypes.IpcChannels - For IPC channel names
 */
