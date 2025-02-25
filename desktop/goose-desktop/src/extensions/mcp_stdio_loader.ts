import { spawn, type ChildProcess } from 'child_process';
import { ErrorCode, createToolError } from './mcp_error_utils';
import type {
  Tool,
  ExecutionContext,
  ToolResult,
  ValidationResult
} from './mcp_core_types';
import { McpError } from './mcp_builtin_loader';

/**
 * Configuration for stdio-based tools
 */
interface StdioConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
}

/**
 * Loader for tools that communicate via stdio (stdin/stdout)
 */
export class StdioToolLoader {
  private tools: Map<string, Tool>;
  private processes: Map<string, ChildProcess>;
  private config: StdioConfig;

  constructor(config: StdioConfig) {
    this.tools = new Map();
    this.processes = new Map();
    this.config = config;
  }

  /**
   * Initialize child process for a tool
   */
  private initializeProcess(toolName: string): ChildProcess {
    const childProcess = spawn(this.config.command, this.config.args ?? [], {
      env: {
        ...process.env,
        ...this.config.env
      },
      cwd: this.config.cwd,
      stdio: ['pipe', 'pipe', 'pipe'] // stdin, stdout, stderr
    });

    // Handle process errors
    childProcess.on('error', (error: Error) => {
      console.error(`Process error for tool ${toolName}:`, error);
      this.restartProcess(toolName);
    });

    // Handle process exit
    childProcess.on('exit', (code: number | null) => {
      if (code !== 0) {
        console.error(`Process exited with code ${code} for tool ${toolName}`);
        this.restartProcess(toolName);
      }
    });

    // Handle stderr
    childProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`[${toolName}] stderr:`, data.toString());
    });

    this.processes.set(toolName, childProcess);
    return childProcess;
  }

  /**
   * Restart a tool's process
   */
  private restartProcess(toolName: string): void {
    const oldProcess = this.processes.get(toolName);
    if (oldProcess) {
      oldProcess.kill();
      this.processes.delete(toolName);
    }
    this.initializeProcess(toolName);
  }

  /**
   * Register a new stdio-based tool
   */
  registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new McpError(
        ErrorCode.VALIDATION_FAILED,
        `Tool ${tool.name} is already registered`
      );
    }
    this.tools.set(tool.name, tool);
    this.initializeProcess(tool.name);
  }

  /**
   * Get all registered stdio tools
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
   * Execute a stdio-based tool
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

    const childProcess = this.processes.get(toolName);
    if (!childProcess) {
      return createToolError(
        ErrorCode.EXECUTION_FAILED,
        `Process not found for tool ${toolName}`
      );
    }

    try {
      // Execute the tool's logic
      const result = await tool.execute(parameters);

      // Send execution result through stdio
      const message = JSON.stringify({
        type: 'tool_execution',
        toolName,
        parameters,
        context,
        result
      }) + '\n';

      childProcess.stdin?.write(message);

      return result;
    } catch (error) {
      return createToolError(
        ErrorCode.EXECUTION_FAILED,
        `Error executing tool ${toolName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Clean up processes and resources
   */
  async dispose(): Promise<void> {
    // Kill all child processes
    for (const childProcess of this.processes.values()) {
      childProcess.kill();
    }
    this.processes.clear();
    this.tools.clear();
  }
}