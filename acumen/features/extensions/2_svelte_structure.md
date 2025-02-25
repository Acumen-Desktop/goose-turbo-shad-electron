# Svelte UI Structure

## Project Organization

```
desktop/goose-desktop/src/extensions/
├── api/
│   ├── extension_api_types.ts        # Extension API type definitions
│   ├── extension_api_errors.ts       # API-specific error handling
│   └── extension_api_validation.ts   # API input validation
│
├── core/
│   ├── extension_core_types.ts       # Core MCP type definitions
│   ├── extension_manager.ts          # Extension lifecycle management
│   ├── extension_security.ts         # Security implementation
│   └── extension_results.ts          # Result type handling
│
├── servers/
│   ├── base/
│   │   ├── server_base_types.ts      # Base server type definitions
│   │   └── server_base_implementation.ts  # Base server functionality
│   │
│   ├── mcp-wiki/                     # Example MCP server
│   │   ├── mcp_wiki_server.ts        # Wiki server implementation
│   │   ├── mcp_wiki_config.ts        # Wiki server configuration
│   │   └── tools/                    # Wiki-specific tools
│   │
│   └── mcp-realty/                   # Another MCP server example
│
└── utils/
    ├── extension_validation_utils.ts  # Shared validation utilities
    ├── extension_security_utils.ts    # Shared security utilities
    └── extension_test_utils.ts        # Testing utilities


apps/                   # Svelte applications
├── docs/              # Documentation app
└── shad_starter/      # Main application template
    └── src/
        ├── routes/    # SvelteKit routes
        └── lib/       # Shared utilities and components

packages/              # Shared packages
└── ui/               # UI component library
    ├── components/   # Base components
    └── shadcn/      # Shadcn-svelte components
```

## Extension Components

```svelte
<!-- ExtensionList.svelte -->
<script lang="ts">
  import { extensions } from '$lib/stores/extensions'
  import ExtensionCard from './ExtensionCard.svelte'
</script>

{#each $extensions as extension (extension.name)}
  <ExtensionCard {extension} />
{/each}
```

## State Management

```typescript
// stores/extensions.ts
import { writable } from 'svelte/store'
import type { ExtensionConfig } from '../types'

export const extensions = writable<ExtensionConfig[]>([])
export const extensionStatus = writable<Record<string, unknown>>({})

// Derived store for active extensions
export const activeExtensions = derived(extensions, $exts => 
  $exts.filter(e => e.status === 'active')
)
```

## Toast Notifications

Using svelte-sonner for notifications:
```typescript
import { toast } from 'svelte-sonner'

// Success notification
toast.success('Extension loaded successfully')

// Error notification
toast.error('Failed to load extension', {
  description: error.message
})
```

## Component Guidelines

1. Use Functional Components
   - Prefer pure functions
   - Avoid class-based patterns
   - Use stores for state management

2. Props Interface
   ```typescript
   interface ExtensionCardProps {
     extension: ExtensionConfig
     onStatusChange?: (status: string) => void
   }
   ```

3. Event Handling
   ```svelte
   <button on:click={() => handleToolExecution(tool)}>
     Execute Tool
   </button>
   ```

4. Stores Usage
   ```svelte
   <script>
     import { extensions } from '$lib/stores/extensions'
     
     $: activeCount = $extensions.filter(e => e.active).length
   </script>
   ```

## Component Locations

1. Base Components (packages/ui/components/)
   - Generic, reusable components
   - Framework-agnostic design
   - Pure presentation components

2. Feature Components (apps/shad_starter/src/lib/components/)
   - Extension-specific components
   - Business logic components
   - Route-specific components

3. Layout Components (apps/shad_starter/src/routes/)
   - Page layouts
   - Navigation structure
   - Route handlers

## Best Practices

1. Component Design
   - Single responsibility
   - Pure functions where possible
   - Clear prop interfaces
   - TypeScript for type safety

2. State Management
   - Use Svelte stores
   - Minimize global state
   - Clear update patterns
   - Reactive declarations

3. Error Handling
   - Consistent error display
   - Toast notifications
   - Error boundaries
   - Clear error messages

4. Performance
   - Lazy loading
   - Proper cleanup
   - Efficient reactivity
   - Minimal re-renders