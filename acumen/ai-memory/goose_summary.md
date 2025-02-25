# Goose Project Overview for New Developers

## What is Goose?

Goose is an open-source AI agent designed to supercharge software development by automating coding tasks. It builds upon the basic interaction framework of Large Language Models (LLMs) by enhancing the standard "text in, text out" approach with powerful tool integrations.

## Core Architecture

### Main Components

1. **Interface Layer**
   - Available as both a Desktop application (macOS) and CLI
   - Handles user input/output
   - Can create multiple agent instances for concurrent tasks

2. **Agent Layer**
   - Manages the core interactive loop
   - Processes user requests
   - Coordinates with LLM providers and extensions
   - Handles context management and token optimization

3. **Extensions Layer**
   - Provides specific tools and capabilities
   - Based on the Model Context Protocol (MCP)
   - Includes built-in and custom extension support

### Interactive Loop Flow

1. User submits a request/task
2. Agent forwards request to LLM provider with available tools
3. LLM creates tool call requests as needed
4. Agent executes tool calls through appropriate extensions
5. Results are sent back to LLM for processing
6. Context is optimized to manage token usage
7. Final response is returned to user

## Extension System

### Core Concepts

1. **Extensions**
   - Self-contained components that provide specific functionality
   - Maintain their own state
   - Expose capabilities through tools
   - Follow the Model Context Protocol (MCP) standard

2. **Tools**
   - Functions that perform specific actions
   - Have defined names, descriptions, and parameters
   - Return structured results or errors
   - Enable the AI to interact with external systems

### Built-in Extensions

- Developer Tools
- Computer Controller (web scraping, file operations, automation)
- Google Drive Integration
- Memory Management
- JetBrains Integration

## Key Features

1. **Error Handling**
   - Robust error capture and processing
   - Errors are sent back to LLM for resolution
   - Maintains flow continuity during issues

2. **Token Management**
   - Smart context revision
   - Uses faster/smaller LLMs for summarization
   - Optimizes large file operations
   - Implements efficient command output handling

3. **Session Management**
   - Supports continuous conversations
   - Maintains context across interactions
   - Allows multiple concurrent sessions

## Getting Started

1. **Installation**
   ```bash
   # CLI Installation
   curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | bash
   
   # Desktop: Download from GitHub releases (macOS only)
   ```

2. **Provider Setup**
   - Configure preferred LLM provider (OpenAI, Anthropic, etc.)
   - Set up API keys
   - Select appropriate model (GPT-4o or Claude 3.5 Sonnet recommended)

3. **Extension Configuration**
   - Enable needed built-in extensions
   - Configure external extensions if required
   - Set up extension-specific settings

## Best Practices

1. **Tool Design**
   - Use clear, action-oriented names
   - Provide detailed parameter descriptions
   - Implement specific error handling
   - Document state modifications

2. **Extension Development**
   - Encapsulate state properly
   - Propagate errors effectively
   - Maintain clear documentation
   - Implement comprehensive testing

## Next Steps for Developers

1. Explore the [built-in extensions](/docs/getting-started/using-extensions#built-in-extensions)
2. Review the [Extensions Design Guide](/docs/goose-architecture/extensions-design)
3. Consider [creating custom extensions](/docs/tutorials/custom-extensions)
4. Understand [error handling](/docs/goose-architecture/error-handling)
5. Learn about [GooseHints](/docs/guides/using-goosehints) for session optimization