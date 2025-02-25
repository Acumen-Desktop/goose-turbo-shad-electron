import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SseToolLoader } from '../mcp_sse_loader';
import { ErrorCode } from '../mcp_error_utils';
import type { Tool, ExecutionContext } from '../mcp_core_types';

// Mock EventSource since it's not available in Node
const mockClose = vi.fn();
const MockEventSource = vi.fn().mockImplementation((url: string, options?: EventSourceInit) => ({
  url,
  options,
  onerror: null as ((error: any) => void) | null,
  close: mockClose
}));

vi.stubGlobal('EventSource', MockEventSource);

describe('SseToolLoader', () => {
  let loader: SseToolLoader;
  let mockTool: Tool;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    loader = new SseToolLoader({
      uri: 'http://localhost:3000/events'
    });

    mockTool = {
      name: 'test-sse-tool',
      description: 'A test SSE tool',
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
      toolName: 'test-sse-tool',
      params: { 'required-param': 'test' },
      timestamp: Date.now()
    };
  });

  afterEach(() => {
    loader.dispose();
  });

  describe('registerTool', () => {
    it('should register a new tool and initialize EventSource', () => {
      loader.registerTool(mockTool);
      const tools = loader.getTools();
      expect(tools).toHaveLength(1);
      expect(tools[0]).toBe(mockTool);
      expect(MockEventSource).toHaveBeenCalledWith(
        'http://localhost:3000/events',
        expect.any(Object)
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
      const result = await loader.validateParameters('test-sse-tool', {
        'required-param': 'test'
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when required parameter is missing', async () => {
      loader.registerTool(mockTool);
      const result = await loader.validateParameters('test-sse-tool', {});
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
        'test-sse-tool',
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
    it('should close all EventSource connections and clear tools', async () => {
      loader.registerTool(mockTool);
      expect(loader.getTools()).toHaveLength(1);
      await loader.dispose();
      expect(loader.getTools()).toHaveLength(0);
      expect(mockClose).toHaveBeenCalled();
    });
  });

  describe('SSE error handling', () => {
    it('should handle SSE connection errors', () => {
      vi.useFakeTimers();
      loader.registerTool(mockTool);
      
      // Get the created EventSource instance
      const initialCallCount = MockEventSource.mock.calls.length;
      
      // Simulate SSE error by calling onerror on the created instance
      const eventSource = (MockEventSource.mock.results[0].value as any);
      if (eventSource.onerror) {
        eventSource.onerror(new Error('Connection failed'));
      }

      // Should attempt to reconnect after interval
      vi.advanceTimersByTime(3000);
      
      // Verify a new EventSource was created
      expect(MockEventSource.mock.calls.length).toBe(initialCallCount + 1);
      vi.useRealTimers();
    });
  });
});