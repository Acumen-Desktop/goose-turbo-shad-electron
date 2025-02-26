import { registerExtensionListeners } from './main-event-listeners/extension.listener';

/**
 * Sets up all IPC event listeners for the main process
 */
export const setupMainProcessListeners = () => {
	// Set up MCP event listeners
	const cleanupMcp = registerExtensionListeners();

	// Return cleanup function
	return () => {
		cleanupMcp();
	};
};
