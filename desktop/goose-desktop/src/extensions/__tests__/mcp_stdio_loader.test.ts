import './mocks/child_process.mock';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { StdioToolLoader } from '../mcp_stdio_loader';
import { ErrorCode } from '../mcp_error_utils';
import type { Tool, ExecutionContext } from '../mcp_core_types';
import { mockSpawn, createMockProcess, type MockChildProcess } from './mocks/child_process.mock';

describe('StdioToolLoader', () => {
  let loader: StdioToolLoader;
  let mockTool: Tool;
  let mockContext: ExecutionContext;
  let currentProcess: MockChildProcess;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create new mock process for each test
    currentProcess = createMockProcess();
    mockSpawn.mockReturnValue(currentProcess);
    
    loader = new StdioToolLoader({
      command: 'node',
      args: ['tool.js'],
      env: { NODE_ENV: 'test' }
    });

    mockTool = {
      name: 'test-stdio-tool',
      description: 'A test stdio tool',
      parameters: [
        {
          name: 'required-param',
          description: 'A required parameter',
          type: 'string',
          required: true
        },
        {
          name: 'optional-param',
          description: 'An optional parameter',
          type: 'number',
          required: false
        }
      ],
      execute: async (params: unknown) => ({
        data: { received: params }
      })
    };

    mockContext = {
      extensionName: 'test-extension',
      toolName: 'test-stdio-tool',
      params: { 'required-param': 'test' },
      timestamp: Date.now()
    };
  });

  afterEach(async () => {
    await loader.dispose();
    currentProcess.cleanup();
  });

  describe('registerTool', () => {
    it('should register a new tool and initialize process', () => {
      loader.registerTool(mockTool);
      const tools = loader.getTools();
      expect(tools).toHaveLength(1);
      expect(tools[0]).toBe(mockTool);
      expect(mockSpawn).toHaveBeenCalledWith(
        'node',
        ['tool.js'],
        expect.objectContaining({
          env: expect.objectContaining({ NODE_ENV: 'test' })
        })
      );
    });

    it('should throw error when registering duplicate tool', () => {
      loader.registerTool(mockTool);
      expect(() => loader.registerTool(mockTool)).toThrow();
    });
  });

  describe('validateParameters', () => {
    it('should validate required parameters', async () => {
      loader.registerTool(mockTool);
      const result = await loader.validateParameters('test-stdio-tool', {
        'required-param': 'test'
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when required parameter is missing', async () => {
      loader.registerTool(mockTool);
      const result = await loader.validateParameters('test-stdio-tool', {});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required parameter: required-param');
    });

    it('should return error for non-existent tool', async () => {
      const result = await loader.validateParameters('non-existent', {});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Tool non-existent not found');
    });
  });

  describe('executeTool', () => {
    it('should execute tool and write to stdin', async () => {
      loader.registerTool(mockTool);
      
      const result = await loader.executeTool(
        'test-stdio-tool',
        { 'required-param': 'test' },
        mockContext
      );

      expect(result.error).toBeUndefined();
      expect(result.data).toEqual({
        received: { 'required-param': 'test' }
      });
      expect(currentProcess.stdin.write).toHaveBeenCalledWith(
        expect.stringContaining('"type":"tool_execution"')
      );
    });

    it('should handle non-existent tool', async () => {
      const result = await loader.executeTool(
        'non-existent',
        {},
        mockContext
      );
      expect(result.error).toBe(true);
      expect(result.data).toMatchObject({
        code: ErrorCode.TOOL_NOT_FOUND
      });
    });

    it('should handle execution errors', async () => {
      const errorTool: Tool = {
        ...mockTool,
        name: 'error-tool',
        execute: async () => {
          throw new Error('Test error');
        }
      };
      loader.registerTool(errorTool);
      const result = await loader.executeTool(
        'error-tool',
        {},
        mockContext
      );
      expect(result.error).toBe(true);
      expect(result.data).toMatchObject({
        code: ErrorCode.EXECUTION_FAILED
      });
    });
  });

  describe('process management', () => {
    it('should restart process on error', () => {
      loader.registerTool(mockTool);
      const initialCallCount = mockSpawn.mock.calls.length;

      // Simulate process error
      currentProcess.emit('error', new Error('Process error'));

      expect(mockSpawn).toHaveBeenCalledTimes(initialCallCount + 1);
    });

    it('should restart process on non-zero exit', () => {
      loader.registerTool(mockTool);
      const initialCallCount = mockSpawn.mock.calls.length;

      // Simulate process exit
      currentProcess.emit('exit', 1);

      expect(mockSpawn).toHaveBeenCalledTimes(initialCallCount + 1);
    });

    it('should handle stderr output', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      loader.registerTool(mockTool);

      // Simulate stderr output
      currentProcess.stderr.emit('data', Buffer.from('Test error output'));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-stdio-tool'),
        expect.stringContaining('Test error output')
      );
    });
  });

  describe('dispose', () => {
    it('should kill all processes and clear tools', async () => {
      loader.registerTool(mockTool);
      
      expect(loader.getTools()).toHaveLength(1);
      await loader.dispose();
      expect(loader.getTools()).toHaveLength(0);
      expect(currentProcess.kill).toHaveBeenCalled();
    });
  });
});