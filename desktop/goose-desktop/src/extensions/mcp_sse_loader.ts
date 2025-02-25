import { ErrorCode, createToolError } from './mcp_error_utils';
import type {
  Tool,
  ExecutionContext,
  ToolResult,
  ValidationResult
} from './mcp_core_types';
import { McpError } from './mcp_builtin_loader';

/**
 * Configuration for SSE-based tools
 */
interface SseConfig {
  uri: string;
  headers?: Record<string, string>;
  reconnectInterval?: number;
}

/**
 * Loader for tools that communicate via Server-Sent Events
 */
export class SseToolLoader {
  private tools: Map<string, Tool>;
  private eventSources: Map<string, EventSource>;
  private config: SseConfig;

  constructor(config: SseConfig) {
    this.tools = new Map();
    this.eventSources = new Map();
    this.config = {
      reconnectInterval: 3000,
      ...config
    };
  }

  /**
   * Initialize SSE connection for a tool
   */
  private initializeEventSource(toolName: string): EventSource {
    const eventSource = new EventSource(this.config.uri, {
      withCredentials: true
    });

    eventSource.onerror = (error) => {
      console.error(`SSE error for tool ${toolName}:`, error);
      // Attempt to reconnect after interval
      setTimeout(() => {
        this.reconnect(toolName);
      }, this.config.reconnectInterval);
    };

    this.eventSources.set(toolName, eventSource);
    return eventSource;
  }

  /**
   * Reconnect a tool's SSE connection
   */
  private reconnect(toolName: string): void {
    const oldEventSource = this.eventSources.get(toolName);
    if (oldEventSource) {
      oldEventSource.close();
      this.eventSources.delete(toolName);
    }
    this.initializeEventSource(toolName);
  }

  /**
   * Register a new SSE-based tool
   */
  registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new McpError(
        ErrorCode.VALIDATION_FAILED,
        `Tool ${tool.name} is already registered`
      );
    }
    this.tools.set(tool.name, tool);
    this.initializeEventSource(tool.name);
  }

  /**
   * Get all registered SSE tools
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
   * Execute an SSE-based tool
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

    const eventSource = this.eventSources.get(toolName);
    if (!eventSource) {
      return createToolError(
        ErrorCode.EXECUTION_FAILED,
        `SSE connection not established for tool ${toolName}`
      );
    }

    try {
      // Execute the tool's logic
      const result = await tool.execute(parameters);

      // Send execution result through SSE connection
      const message = {
        type: 'tool_execution',
        toolName,
        parameters,
        context,
        result
      };

      // Use postMessage if available (e.g., in development)
      if (typeof window !== 'undefined' && window.postMessage) {
        window.postMessage(message, '*');
      }

      return result;
    } catch (error) {
      return createToolError(
        ErrorCode.EXECUTION_FAILED,
        `Error executing tool ${toolName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Clean up SSE connections and resources
   */
  async dispose(): Promise<void> {
    // Close all SSE connections
    for (const eventSource of this.eventSources.values()) {
      eventSource.close();
    }
    this.eventSources.clear();
    this.tools.clear();
  }
}