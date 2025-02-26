import log from '../../utils/logger';
import type { Tool } from '../mcp_core_types';
import { extensionManager } from '../mcp_extension_manager';

/**
 * Test extension with simple hello world tool
 */
export const createTestExtension = async () => {
	// Create test tools
	const tools: Tool[] = [
		{
			name: 'hello',
			description: 'A simple hello world tool',
			parameters: [
				{
					name: 'name',
					description: 'Name to greet',
					type: 'string',
					required: true
				}
			],
			execute: async (params: unknown) => {
				const { name } = params as { name: string };
				log.info(`Test extension executing hello tool with name: ${name}`);
				return {
					data: `Hello, ${name}!`,
					error: false
				};
			}
		}
	];

	// Register with extension manager
	try {
		const result = await extensionManager.registerExtension({
			name: 'test-extension',
			type: 'builtin',
			tools
		});

		if (result.success) {
			log.info('Test extension registered successfully');
			return true;
		} else {
			log.error(`Failed to register test extension: ${result.message}`);
			return false;
		}
	} catch (error) {
		log.error('Error registering test extension:', error);
		return false;
	}
};
