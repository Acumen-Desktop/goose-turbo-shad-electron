/**
 * Core types for the Model Context Protocol (MCP) implementation
 */

/**
 * Represents a tool parameter with type information and validation requirements
 */
export type ToolParameter = {
  name: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'object'
  required: boolean
}

/**
 * Result of a tool execution containing success/error information
 */
export type ToolResult = {
  error?: boolean
  prompt?: string
  data?: unknown
}

/**
 * Represents an executable tool with metadata and parameters
 */
export type Tool = {
  name: string
  description: string
  parameters: ToolParameter[]
  execute: (params: unknown) => Promise<ToolResult>
}

/**
 * Configuration for an MCP extension
 */
export type ExtensionConfig = {
  type: 'sse' | 'stdio' | 'builtin'
  name: string
  uri?: string
  cmd?: string
  args?: string[]
  env_keys?: string[]
  tools?: Tool[] // Added tools array
}

/**
 * Type for extension validation results
 */
export type ValidationResult = {
  valid: boolean
  errors: string[]
}

/**
 * Type for extension registration results
 */
export type RegistrationResult = {
  success: boolean
  message: string
  extension?: Tool[]
}

/**
 * Type for tool execution context
 */
export type ExecutionContext = {
  extensionName: string
  toolName: string
  params: unknown
  timestamp: number
}

/**
 * Type for MCP request
 */
export type McpRequest<T = unknown> = {
  params: T
  id: string
  jsonrpc: '2.0'
  method: string
}