/**
 * Error handling utilities for MCP implementation
 */

import type { ToolResult, ValidationResult, ExecutionContext } from './mcp_core_types'

/**
 * Error codes for MCP operations
 */
export const ErrorCode = {
  TOOL_NOT_FOUND: 'TOOL_NOT_FOUND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  EXECUTION_FAILED: 'EXECUTION_FAILED',
  EXTENSION_NOT_FOUND: 'EXTENSION_NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SECURITY_ERROR: 'SECURITY_ERROR'
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]

/**
 * Creates a structured tool error with context
 */
export const createToolError = (
  code: ErrorCodeType,
  message: string,
  context?: Record<string, unknown>
): ToolResult => ({
  error: true,
  prompt: `Error executing tool: ${message}\nContext: ${JSON.stringify(context)}`,
  data: {
    code,
    message,
    context,
    timestamp: Date.now()
  }
})

/**
 * Safely executes a tool with error handling
 */
export const executeToolSafely = async (
  tool: (params: unknown) => Promise<ToolResult>,
  context: ExecutionContext
): Promise<ToolResult> => {
  try {
    return await tool(context.params)
  } catch (error) {
    return createToolError(
      ErrorCode.EXECUTION_FAILED,
      error instanceof Error ? error.message : 'Unknown error occurred',
      {
        extensionName: context.extensionName,
        toolName: context.toolName,
        timestamp: context.timestamp
      }
    )
  }
}

/**
 * Validates extension configuration
 */
export const validateExtensionConfig = (
  name: string,
  type: string,
  config: Record<string, unknown>
): ValidationResult => {
  const errors: string[] = []

  if (!name?.trim()) {
    errors.push('Extension name is required')
  }

  if (!['sse', 'stdio', 'builtin'].includes(type)) {
    errors.push('Invalid extension type')
  }

  // Validate required fields based on type
  if (type === 'sse' && !config.uri) {
    errors.push('URI is required for SSE extensions')
  }

  if (type === 'stdio' && (!config.cmd || !Array.isArray(config.args))) {
    errors.push('Command and arguments are required for stdio extensions')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Creates a validation error result
 */
export const createValidationError = (errors: string[]): ToolResult => 
  createToolError(
    ErrorCode.VALIDATION_FAILED,
    'Validation failed',
    { errors }
  )

/**
 * Validates tool parameters against their schema
 */
export const validateToolParams = (
  params: unknown,
  requiredTypes: Record<string, string>
): ValidationResult => {
  const errors: string[] = []
  const paramObj = params as Record<string, unknown>

  Object.entries(requiredTypes).forEach(([key, type]) => {
    if (!(key in paramObj)) {
      errors.push(`Missing required parameter: ${key}`)
    } else if (typeof paramObj[key] !== type) {
      errors.push(`Invalid type for parameter ${key}: expected ${type}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Creates a security error result
 */
export const createSecurityError = (message: string): ToolResult =>
  createToolError(
    ErrorCode.SECURITY_ERROR,
    message,
    { timestamp: Date.now() }
  )