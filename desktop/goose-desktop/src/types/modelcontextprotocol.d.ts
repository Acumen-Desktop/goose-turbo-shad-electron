declare module '@modelcontextprotocol/sdk' {
  export class Server {
    constructor(
      info: {
        name: string
        version: string
      },
      config: {
        capabilities: {
          tools: Record<string, unknown>
          resources: Record<string, unknown>
        }
      }
    )

    setRequestHandler<T>(
      schema: unknown,
      handler: (request: { params: T; id: string; jsonrpc: '2.0'; method: string }) => Promise<unknown>
    ): void

    connect(transport: StdioServerTransport): Promise<void>
    close(): Promise<void>
  }

  export class StdioServerTransport {
    constructor()
  }

  export class McpError extends Error {
    constructor(code: string, message: string)
  }

  export const CallToolRequestSchema: unique symbol
  export const ListToolsRequestSchema: unique symbol

  export const ErrorCode: {
    InvalidRequest: string
    MethodNotFound: string
    InvalidParams: string
    InternalError: string
    ParseError: string
  }
}