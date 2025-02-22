import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../types/interfaces';
import { handleLogInfo, handleShowNotification } from './notifications';
import { handlePing } from './pingPong';
import {
	handleCheckOllama,
	handleFetchMetadata,
	handleGetBinaryPath,
	handleOpenInChrome,
	handleReloadApp,
	handleStartPowerSaveBlocker,
	handleStopPowerSaveBlocker
} from './system';
import {
	handleCreateChatWindow,
	handleCreateWingToWingWindow,
	handleDirectoryChooser,
	handleHideWindow,
	handleSelectFileOrDirectory
} from './window';

/**
 * Registers all IPC handlers
 */
export const registerIpcHandlers = () => {
	// Window Management
	ipcMain.on(IPC_CHANNELS.CREATE_CHAT_WINDOW, handleCreateChatWindow);
	ipcMain.on(IPC_CHANNELS.CREATE_WING_TO_WING_WINDOW, handleCreateWingToWingWindow);
	ipcMain.on(IPC_CHANNELS.HIDE_WINDOW, handleHideWindow);
	ipcMain.on(IPC_CHANNELS.DIRECTORY_CHOOSER, handleDirectoryChooser);
	ipcMain.handle(IPC_CHANNELS.SELECT_FILE_OR_DIRECTORY, handleSelectFileOrDirectory);

	// System Integration
	ipcMain.on(IPC_CHANNELS.OPEN_IN_CHROME, handleOpenInChrome);
	ipcMain.handle(IPC_CHANNELS.FETCH_METADATA, handleFetchMetadata);
	ipcMain.on(IPC_CHANNELS.RELOAD_APP, handleReloadApp);
	ipcMain.handle(IPC_CHANNELS.GET_BINARY_PATH, handleGetBinaryPath);
	ipcMain.handle(IPC_CHANNELS.START_POWER_SAVE_BLOCKER, handleStartPowerSaveBlocker);
	ipcMain.handle(IPC_CHANNELS.STOP_POWER_SAVE_BLOCKER, handleStopPowerSaveBlocker);
	ipcMain.handle(IPC_CHANNELS.CHECK_OLLAMA, handleCheckOllama);

	// Notifications & Logging
	ipcMain.on(IPC_CHANNELS.NOTIFY, handleShowNotification);
	ipcMain.on(IPC_CHANNELS.LOG_INFO, handleLogInfo);

	// Test Ping Pong
	ipcMain.on(IPC_CHANNELS.PING, handlePing);
};

/**
 * Removes all IPC handlers
 */
export const removeIpcHandlers = () => {
	// Window Management
	ipcMain.removeHandler(IPC_CHANNELS.SELECT_FILE_OR_DIRECTORY);

	// System Integration
	ipcMain.removeHandler(IPC_CHANNELS.FETCH_METADATA);
	ipcMain.removeHandler(IPC_CHANNELS.GET_BINARY_PATH);
	ipcMain.removeHandler(IPC_CHANNELS.START_POWER_SAVE_BLOCKER);
	ipcMain.removeHandler(IPC_CHANNELS.STOP_POWER_SAVE_BLOCKER);
	ipcMain.removeHandler(IPC_CHANNELS.CHECK_OLLAMA);
};
