# Error Handling Guide

## Core Principles

1. Errors as Data
2. Type Safety
3. Context Preservation
4. AI-Friendly Messages

## Error Types

```typescript
type ToolError = {
  code: string
  message: string
  context?: Record<string, unknown>
  toPrompt: () => string
}

type ValidationError = {
  field: string
  message: string
  value?: unknown
}

type Result<T, E = ToolError> = 
  | { ok: true; value: T }
  | { ok: false; error: E }
```

## Error Creation

```typescript
const createToolError = (
  code: string,
  message: string,
  context?: Record<string, unknown>
): ToolError => ({
  code,
  message,
  context,
  toPrompt: () => `Error executing tool: ${message}\nContext: ${JSON.stringify(context)}`
})

const createValidationError = (
  field: string,
  message: string,
  value?: unknown
): ValidationError => ({
  field,
  message,
  value
})
```

## Error Handling Patterns

```typescript
// Result type pattern
const executeTool = async (tool: Tool, params: unknown): Promise<Result<ToolResult>> => {
  try {
    const result = await tool.execute(params)
    return { ok: true, value: result }
  } catch (error) {
    return {
      ok: false,
      error: createToolError('EXECUTION_ERROR', error.message)
    }
  }
}

// Usage
const handleToolExecution = async (tool: Tool, params: unknown) => {
  const result = await executeTool(tool, params)
  
  if (!result.ok) {
    toast.error(result.error.toPrompt())
    return
  }
  
  toast.success('Tool executed successfully')
}
```

## Validation

```typescript
const validateExtensionConfig = (
  config: unknown
): Result<ExtensionConfig, ValidationError[]> => {
  const errors: ValidationError[] = []
  
  if (!config || typeof config !== 'object') {
    return {
      ok: false,
      error: [createValidationError('config', 'Invalid configuration object')]
    }
  }

  // Type validation
  if (!['sse', 'stdio', 'builtin'].includes(config.type)) {
    errors.push(createValidationError('type', 'Invalid extension type'))
  }

  // Required fields
  if (!config.name) {
    errors.push(createValidationError('name', 'Name is required'))
  }

  return errors.length > 0
    ? { ok: false, error: errors }
    : { ok: true, value: config as ExtensionConfig }
}
```

## Error Display

```typescript
// Toast notifications
const displayError = (error: ToolError | ValidationError) => {
  if ('toPrompt' in error) {
    toast.error(error.toPrompt())
  } else {
    toast.error(`${error.field}: ${error.message}`)
  }
}

// Error component
const ErrorDisplay = (error: ToolError | ValidationError) => `
  <div class="error-container">
    <div class="error-title">${error.code || error.field}</div>
    <div class="error-message">${error.message}</div>
    ${error.context ? `<pre>${JSON.stringify(error.context, null, 2)}</pre>` : ''}
  </div>
`
```

## Error Propagation

```typescript
// Type-safe error propagation
const propagateError = <T>(
  result: Result<T>,
  context: Record<string, unknown>
): Result<T> => {
  if (!result.ok) {
    return {
      ok: false,
      error: {
        ...result.error,
        context: { ...result.error.context, ...context }
      }
    }
  }
  return result
}

// Usage
const loadExtension = async (config: unknown): Promise<Result<Extension>> => {
  const validationResult = validateExtensionConfig(config)
  if (!validationResult.ok) {
    return validationResult
  }

  const loadResult = await loadExtensionTools(validationResult.value)
  return propagateError(loadResult, { config: validationResult.value })
}
```

## Best Practices

1. Type Safety
   - Use TypeScript strictly
   - Define clear error types
   - Validate all inputs
   - Use Result types

2. Error Context
   - Include relevant data
   - Preserve error chain
   - Add debugging context
   - Keep sensitive data safe

3. User Experience
   - Clear error messages
   - Actionable feedback
   - Consistent display
   - Proper error levels

4. Development
   - Error boundaries
   - Logging strategy
   - Debug information
   - Error monitoring