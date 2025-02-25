# MCP Testing Notes

## Test Infrastructure

1. Testing Framework
   - Using Vitest for unit testing
   - Configuration in vitest.config.ts
   - Test scripts in package.json:
     * `test`: Run tests in watch mode
     * `test:coverage`: Run tests with coverage report

2. Test Location
   - Tests located in `src/extensions/__tests__/`
   - Following naming convention: `*.test.ts`

## Current Test Coverage

1. Built-in Tool Loader (`mcp_builtin_loader.test.ts`)
   - Tool Registration
     * Successful registration
     * Duplicate tool handling
   - Parameter Validation
     * Required parameter checks
     * Missing parameter detection
     * Non-existent tool handling
   - Tool Execution
     * Successful execution flow
     * Error handling
     * Non-existent tool handling
   - Resource Management
     * Proper cleanup on dispose

2. Stdio Tool Loader (`mcp_stdio_loader.test.ts`)
   - Tool Registration
     * Process initialization
     * Duplicate tool handling
   - Parameter Validation
     * Required parameter checks
     * Missing parameter detection
     * Non-existent tool handling
   - Tool Execution
     * Stdin/stdout communication
     * Error handling
     * Non-existent tool handling
   - Process Management
     * Automatic restart on error
     * Restart on non-zero exit
     * Stderr output handling
   - Resource Management
     * Process cleanup on dispose

## Test Patterns

1. Setup/Teardown
   - Using beforeEach for test isolation
   - Mock tool and context creation
   - Clean state for each test
   - Resource cleanup in afterEach

2. Error Handling
   - Testing error cases explicitly
   - Verifying error messages
   - Checking error types
   - Process error simulation

3. Async Testing
   - Using async/await pattern
   - Testing promise resolutions
   - Error propagation in async context
   - Event-driven communication

4. Process Mocking
   - EventEmitter-based mocks
   - Stdin/stdout simulation
   - Process lifecycle events
   - Memory leak prevention
   - Mock cleanup and isolation

## Next Steps

1. SSE Loader Testing
   - Mock SSE connections
   - Test event handling
   - Connection lifecycle tests
   - Reconnection scenarios

2. Integration Tests
   - Cross-loader interactions
   - Extension manager integration
   - Full execution pipeline
   - Error propagation across boundaries

3. IPC Integration Testing
   - Main process handlers
   - Renderer process communication
   - Event synchronization
   - Error handling across processes