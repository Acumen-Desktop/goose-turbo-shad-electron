import log from '../../utils/logger';
import { createTestExtension } from './test_extension';

/**
 * Initializes all builtin extensions
 */
export const initializeBuiltinExtensions = async (): Promise<void> => {
	log.info('Initializing builtin extensions...');

	try {
		// Register test extension
		await createTestExtension();

		// Register other builtin extensions here
		// ...

		log.info('Builtin extensions initialized successfully');
	} catch (error) {
		log.error('Error initializing builtin extensions:', error);
	}
};
