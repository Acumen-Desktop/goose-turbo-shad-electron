import { ErrorCode, createToolError } from './mcp_error_utils';
import type {
  Tool,
  ExecutionContext,
  ToolResult,
  ValidationResult
} from './mcp_core_types';

/**
 * Custom error class for MCP-related errors
 */
export class McpError extends Error {
  constructor(
    public readonly code: typeof ErrorCode[keyof typeof ErrorCode],
    message: string
  ) {
    super(message);
    this.name = 'McpError';
  }
}

/**
 * Interface for tool loaders
 */
export interface ToolLoader {
  getTools(): Tool[];
  validateParameters(toolName: string, parameters: Record<string, unknown>): Promise<ValidationResult>;
  executeTool(toolName: string, parameters: Record<string, unknown>, context: ExecutionContext): Promise<ToolResult>;
  dispose(): Promise<void>;
}

/**
 * Loader for built-in tools that are implemented directly in the application
 */
export class BuiltinToolLoader implements ToolLoader {
  private tools: Map<string, Tool>;

  constructor() {
    this.tools = new Map();
  }

  /**
   * Register a new built-in tool
   */
  registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new McpError(
        ErrorCode.VALIDATION_FAILED,
        `Tool ${tool.name} is already registered`
      );
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Get all registered built-in tools
   */
  getTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Validate tool parameters before execution
   */
  async validateParameters(
    toolName: string,
    parameters: Record<string, unknown>
  ): Promise<ValidationResult> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      return {
        valid: false,
        errors: [`Tool ${toolName} not found`]
      };
    }

    const errors: string[] = [];

    // Validate required parameters are present
    for (const param of tool.parameters) {
      if (param.required && !(param.name in parameters)) {
        errors.push(`Missing required parameter: ${param.name}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Execute a built-in tool
   */
  async executeTool(
    toolName: string,
    parameters: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      return createToolError(
        ErrorCode.TOOL_NOT_FOUND,
        `Tool ${toolName} not found`
      );
    }

    try {
      return await tool.execute(parameters);
    } catch (error) {
      return createToolError(
        ErrorCode.EXECUTION_FAILED,
        `Error executing tool ${toolName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Clean up any resources used by the loader
   */
  async dispose(): Promise<void> {
    this.tools.clear();
  }
}