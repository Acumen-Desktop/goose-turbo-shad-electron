# React to Svelte Migration Guide

## Core Changes

### 1. Component Migration

React Components | Svelte Components
----------------|------------------
useState, useEffect | Reactive statements ($:)
useContext | setContext/getContext
Props drilling | Stores
Class components | Script setup
JSX | Svelte template syntax

### 2. State Management

```typescript
// React - useState
const [extensions, setExtensions] = useState<Extension[]>([])

// Svelte - stores
import { writable } from 'svelte/store'
export const extensions = writable<Extension[]>([])

// Usage in components
$: activeExtensions = $extensions.filter(e => e.active)
```

### 3. Lifecycle Management

```typescript
// React
useEffect(() => {
  loadExtensions()
  return () => cleanup()
}, [])

// Svelte
onMount(() => {
  loadExtensions()
})

onDestroy(() => {
  cleanup()
})
```

## Migration Steps

1. Infrastructure Setup
   - Install MCP SDK
   - Setup Svelte environment
   - Configure TypeScript
   - Setup build tools

2. Core Functionality
   - Port extension types
   - Implement MCP interfaces
   - Setup error handling
   - Create extension service

3. UI Components
   - Create base components
   - Implement stores
   - Add toast notifications
   - Setup routing

4. Testing & Validation
   - Unit tests
   - Integration tests
   - Type checking
   - Error handling

## Component Migration Examples

### Extension List

```typescript
// React Version
const ExtensionList: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>([])
  
  useEffect(() => {
    loadExtensions().then(setExtensions)
  }, [])

  return (
    <div>
      {extensions.map(ext => (
        <ExtensionCard key={ext.name} extension={ext} />
      ))}
    </div>
  )
}

// Svelte Version
<script lang="ts">
  import { onMount } from 'svelte'
  import { extensions } from '$lib/stores/extensions'
  import ExtensionCard from './ExtensionCard.svelte'

  onMount(async () => {
    const loaded = await loadExtensions()
    extensions.set(loaded)
  })
</script>

{#each $extensions as extension (extension.name)}
  <ExtensionCard {extension} />
{/each}
```

### Tool Execution

```typescript
// React Version
const ToolExecutor: React.FC<{tool: Tool}> = ({tool}) => {
  const execute = async () => {
    try {
      await executeTool(tool)
      toast.success('Tool executed')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return <button onClick={execute}>Execute</button>
}

// Svelte Version
<script lang="ts">
  import { toast } from 'svelte-sonner'
  
  export let tool: Tool
  
  async function execute() {
    try {
      await executeTool(tool)
      toast.success('Tool executed')
    } catch (error) {
      toast.error(error.message)
    }
  }
</script>

<button on:click={execute}>Execute</button>
```

## Dependency Changes

1. Remove React Dependencies
   ```diff
   - "react": "^18.0.0"
   - "react-dom": "^18.0.0"
   - "react-toastify": "^9.0.0"
   + "@sveltejs/kit": "^1.0.0"
   + "svelte": "^4.0.0"
   + "svelte-sonner": "^0.3.0"
   ```

2. Update Build Configuration
   ```javascript
   // vite.config.ts
   import { sveltekit } from '@sveltejs/kit/vite'

   export default {
     plugins: [sveltekit()]
   }
   ```

## Best Practices

1. Functional Style
   - Use pure functions
   - Avoid class-based patterns
   - Leverage reactive declarations
   - Use stores for state

2. Type Safety
   - Use TypeScript
   - Define clear interfaces
   - Validate props
   - Type store contents

3. Performance
   - Lazy load components
   - Use proper cleanup
   - Optimize reactivity
   - Minimize store updates

4. Error Handling
   - Consistent error display
   - Clear error messages
   - Type-safe error handling
   - Proper error propagation