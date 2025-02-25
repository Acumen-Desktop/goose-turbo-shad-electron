# TypeScript Types Index

This document serves as a quick reference for locating type definitions in the Goose Desktop application.

## Feature-Specific Types
Location: `/main/main_ipc/types/`
- `browser.types.ts` - Browser-related IPC types
- `channels.types.ts` - IPC channel type definitions
- `extension.types.ts` - Extension-related IPC types
- `filesystem.types.ts` - File system operation types
- `system.types.ts` - System-related IPC types
- `window.types.ts` - Window management types
- `index.ts` - Re-exports all IPC types

## Electron-Specific Types
Location: `/main/types/electron/`
- `electron-api.d.ts` - Electron API type definitions
- `squirrel-startup.d.ts` - Squirrel startup type definitions

## Generated Types
Location: `/api/generated/`
- `types.gen.ts` - Auto-generated API types

## SDK Types
Location: `/ai-sdk-fork/core/types/`
- `usage.ts` - AI SDK usage type definitions

## Extension Types
Location: `/extensions/`
- `/api/extension_api_types.ts` - Extension API type definitions
- `/core/extension_core_types.ts` - Extension core functionality types
- `/servers/base/server_base_types.ts` - Base server type definitions

## Model Context Protocol Types
Location: `/types/`
- `modelcontextprotocol.d.ts` - MCP type definitions