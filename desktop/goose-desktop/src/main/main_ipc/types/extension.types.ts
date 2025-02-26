import type {
	ExtensionConfig,
	RegistrationResult,
	Tool,
	ToolResult,
	ValidationResult
} from '../../../extensions/mcp_core_types';

// Extension installation types
export interface ExtensionInstallOptions {
	url: string;
	name?: string;
}

export interface ExtensionResponse {
	success: boolean;
	error?: string;
}

// MCP tool execution types
export interface McpToolExecuteParams {
	extensionName: string;
	toolName: string;
	params: unknown;
}

export interface McpToolExecuteResponse {
	result: ToolResult;
}

// MCP tool listing types
export interface McpToolListParams {
	extensionName?: string; // Optional - if provided, only list tools for this extension
}

export interface McpToolListResponse {
	tools: Tool[];
}

// MCP extension registration types
export interface McpExtensionRegisterParams {
	config?: ExtensionConfig;
	url?: string; // Allow URL-based registration similar to original Goose
}

export interface McpExtensionRegisterResponse {
	result: RegistrationResult;
}

// MCP extension listing types
export interface McpExtensionListResponse {
	extensions: ExtensionConfig[];
}

// Type guards
export const isExtensionInstallOptions = (data: any): data is ExtensionInstallOptions => {
	return (
		typeof data === 'object' &&
		data !== null &&
		typeof data.url === 'string' &&
		(data.name === undefined || typeof data.name === 'string')
	);
};

export const isExtensionResponse = (data: any): data is ExtensionResponse => {
	return (
		typeof data === 'object' &&
		data !== null &&
		typeof data.success === 'boolean' &&
		(data.error === undefined || typeof data.error === 'string')
	);
};

export const isMcpToolExecuteParams = (data: any): data is McpToolExecuteParams => {
	return (
		typeof data === 'object' &&
		data !== null &&
		typeof data.extensionName === 'string' &&
		typeof data.toolName === 'string' &&
		'params' in data
	);
};

export const isMcpToolListParams = (data: any): data is McpToolListParams => {
	return (
		typeof data === 'object' &&
		data !== null &&
		(data.extensionName === undefined || typeof data.extensionName === 'string')
	);
};

export const isMcpExtensionRegisterParams = (data: any): data is McpExtensionRegisterParams => {
	return (
		typeof data === 'object' &&
		data !== null &&
		// Config-based registration
		((typeof data.config === 'object' &&
			data.config !== null &&
			typeof data.config.type === 'string' &&
			typeof data.config.name === 'string') ||
			// URL-based registration
			typeof data.url === 'string')
	);
};
