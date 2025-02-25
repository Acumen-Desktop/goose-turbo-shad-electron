/**
 * Extension manager for MCP implementation
 */

import type { 
  Tool, 
  ExtensionConfig, 
  ToolResult, 
  ExecutionContext,
  RegistrationResult
} from './mcp_core_types'
import { 
  createToolError, 
  executeToolSafely, 
  validateExtensionConfig,
  ErrorCode 
} from './mcp_error_utils'

/**
 * Creates an extension manager instance
 */
export const createExtensionManager = () => {
  // Map of extension name to array of tools
  const extensions = new Map<string, Tool[]>()

  /**
   * Registers a new extension and its tools
   */
  const registerExtension = async (
    config: ExtensionConfig
  ): Promise<RegistrationResult> => {
    const validation = validateExtensionConfig(
      config.name,
      config.type,
      config as Record<string, unknown>
    )

    if (!validation.valid) {
      return {
        success: false,
        message: `Invalid extension configuration: ${validation.errors.join(', ')}`
      }
    }

    try {
      // Load extension tools based on type
      const tools = await loadExtensionTools(config)
      extensions.set(config.name, tools)

      return {
        success: true,
        message: `Successfully registered extension ${config.name}`,
        extension: tools
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to register extension: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Loads tools for an extension based on its type
   */
  const loadExtensionTools = async (config: ExtensionConfig): Promise<Tool[]> => {
    switch (config.type) {
      case 'builtin':
        return loadBuiltinTools(config)
      case 'sse':
        return loadSseTools(config)
      case 'stdio':
        return loadStdioTools(config)
      default:
        throw new Error(`Unsupported extension type: ${config.type}`)
    }
  }

  /**
   * Executes a tool from a specific extension
   */
  const executeTool = async (
    extensionName: string,
    toolName: string,
    params: unknown
  ): Promise<ToolResult> => {
    const extensionTools = extensions.get(extensionName)
    
    if (!extensionTools) {
      return createToolError(
        ErrorCode.EXTENSION_NOT_FOUND,
        `Extension ${extensionName} not found`
      )
    }

    const tool = extensionTools.find(t => t.name === toolName)
    
    if (!tool) {
      return createToolError(
        ErrorCode.TOOL_NOT_FOUND,
        `Tool ${toolName} not found in extension ${extensionName}`
      )
    }

    const context: ExecutionContext = {
      extensionName,
      toolName,
      params,
      timestamp: Date.now()
    }

    return executeToolSafely(tool.execute, context)
  }

  /**
   * Lists all registered extensions and their tools
   */
  const listExtensions = () => {
    const result: Record<string, Tool[]> = {}
    
    for (const [name, tools] of extensions.entries()) {
      result[name] = tools
    }
    
    return result
  }

  /**
   * Gets detailed information about a specific tool
   */
  const getToolInfo = (
    extensionName: string,
    toolName: string
  ): Tool | undefined => {
    const tools = extensions.get(extensionName)
    return tools?.find(t => t.name === toolName)
  }

  /**
   * Removes an extension and its tools
   */
  const removeExtension = (name: string): boolean => {
    return extensions.delete(name)
  }

  return {
    registerExtension,
    executeTool,
    listExtensions,
    getToolInfo,
    removeExtension
  }
}

import { BuiltinToolLoader } from './mcp_builtin_loader';

// Create loaders
const builtinLoader = new BuiltinToolLoader();

const loadBuiltinTools = async (config: ExtensionConfig): Promise<Tool[]> => {
  if (!config.tools || !Array.isArray(config.tools)) {
    throw new Error('No tools defined in builtin extension config');
  }

  // Register each tool with the loader
  for (const tool of config.tools) {
    builtinLoader.registerTool(tool);
  }

  return config.tools;
}

const loadSseTools = async (config: ExtensionConfig): Promise<Tool[]> => {
  // Implementation for SSE-based tools
  throw new Error('SSE tools not yet implemented');
}

const loadStdioTools = async (config: ExtensionConfig): Promise<Tool[]> => {
  // Implementation for stdio-based tools
  throw new Error('stdio tools not yet implemented');
}