import { describe, it, expect, beforeEach } from 'vitest';
import { BuiltinToolLoader, McpError } from '../mcp_builtin_loader';
import { ErrorCode } from '../mcp_error_utils';
import type { Tool, ExecutionContext } from '../mcp_core_types';

describe('BuiltinToolLoader', () => {
  let loader: BuiltinToolLoader;
  let mockTool: Tool;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    loader = new BuiltinToolLoader();
    mockTool = {
      name: 'test-tool',
      description: 'A test tool',
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
      toolName: 'test-tool',
      params: { 'required-param': 'test' },
      timestamp: Date.now()
    };
  });

  describe('registerTool', () => {
    it('should register a new tool successfully', () => {
      loader.registerTool(mockTool);
      const tools = loader.getTools();
      expect(tools).toHaveLength(1);
      expect(tools[0]).toBe(mockTool);
    });

    it('should throw error when registering duplicate tool', () => {
      loader.registerTool(mockTool);
      expect(() => loader.registerTool(mockTool)).toThrow(McpError);
    });
  });

  describe('validateParameters', () => {
    it('should validate required parameters', async () => {
      loader.registerTool(mockTool);
      const result = await loader.validateParameters('test-tool', {
        'required-param': 'test'
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when required parameter is missing', async () => {
      loader.registerTool(mockTool);
      const result = await loader.validateParameters('test-tool', {});
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
    it('should execute tool successfully', async () => {
      loader.registerTool(mockTool);
      const result = await loader.executeTool(
        'test-tool',
        { 'required-param': 'test' },
        mockContext
      );
      expect(result.error).toBeUndefined();
      expect(result.data).toEqual({
        received: { 'required-param': 'test' }
      });
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

  describe('dispose', () => {
    it('should clear all registered tools', async () => {
      loader.registerTool(mockTool);
      expect(loader.getTools()).toHaveLength(1);
      await loader.dispose();
      expect(loader.getTools()).toHaveLength(0);
    });
  });
});