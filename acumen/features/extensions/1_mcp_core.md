# MCP Core Implementation

## Overview
The Model Context Protocol (MCP) enables AI agents to interact with external tools and resources. Our implementation uses functional programming patterns and TypeScript.

## Core Types

```typescript
type Tool = {
  name: string
  description: string
  parameters: {
    name: string
    description: string
    type: 'string' | 'number' | 'boolean' | 'object'
    required: boolean
  }[]
  execute: (params: unknown) => Promise<ToolResult>
}

type ExtensionConfig = {
  type: 'sse' | 'stdio' | 'builtin'
  name: string
  uri?: string
  cmd?: string
  args?: string[]
  env_keys?: string[]
}

type ToolResult = {
  error?: boolean
  prompt?: string
  data?: unknown
}
```

## Error Handling

```typescript
const createToolError = (code: string, message: string, context?: Record<string, unknown>) => ({
  code,
  message,
  context,
  toPrompt: () => `Error executing tool: ${message}\nContext: ${JSON.stringify(context)}`
})

const executeToolSafely = async (tool: Tool, params: unknown): Promise<ToolResult> => {
  try {
    return await tool.execute(params)
  } catch (error) {
    return {
      error: true,
      prompt: error.toPrompt?.() ?? String(error)
    }
  }
}
```

## Extension Management

```typescript
const createExtensionManager = () => {
  const extensions = new Map<string, Tool[]>()
  
  const addExtension = async (config: ExtensionConfig): Promise<void> => {
    // Validate and load extension
    const tools = await loadExtensionTools(config)
    extensions.set(config.name, tools)
  }

  const callTool = async (extension: string, tool: string, params: unknown): Promise<ToolResult> => {
    const extensionTools = extensions.get(extension)
    const targetTool = extensionTools?.find(t => t.name === tool)
    
    if (!targetTool) {
      return createToolError('TOOL_NOT_FOUND', `Tool ${tool} not found in extension ${extension}`)
    }

    return executeToolSafely(targetTool, params)
  }

  return {
    addExtension,
    callTool
  }
}
```

## MCP Server Integration

```typescript
import { Server } from '@modelcontextprotocol/sdk'

const createMcpServer = () => {
  const server = new Server({
    name: 'goose-extension',
    version: '1.0.0',
    capabilities: {
      tools: {},
      resources: {}
    }
  })

  const registerTool = (tool: Tool) => {
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === tool.name) {
        return executeToolSafely(tool, request.params.arguments)
      }
    })
  }

  return {
    server,
    registerTool
  }
}
```

## Security

- Command validation using allowlist
- Environment variable validation
- Deep link validation
- Input sanitization
- Proper error context handling

## Best Practices

1. Use pure functions where possible
2. Handle errors as data using Result types
3. Validate all inputs
4. Provide clear error messages
5. Use TypeScript for type safety
6. Follow MCP specifications strictly