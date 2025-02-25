# Extension System Migration Plan (React to Svelte)

## Current Architecture Analysis

### Core Extension System (Keep)
1. IPC Communication Layer
   - Extension listener (extension.listener.ts)
   - IPC channels (ipc-channels.ts)
   - Type definitions (extension.types.ts)
   - These components are framework-agnostic and can be kept as-is

2. Extension Configuration Types
   ```typescript
   type ExtensionConfig = {
     type: 'sse' | 'stdio' | 'builtin';
     name: string;
     // ... other properties
   };
   ```
   - These type definitions are framework-agnostic
   - Can be reused in Svelte implementation

### React-Specific Components (Replace)

1. Notification System
   ```typescript
   import { toast } from 'react-toastify';
   ```
   Replace with:
   ```typescript
   // TODO: Implement using Svelte Toast
   import { toast } from '@zerodevx/svelte-toast';
   ```

2. View Management
   ```typescript
   import { type View } from './App';
   import { type SettingsViewOptions } from './components/settings/SettingsView';
   ```
   Replace with Svelte routing and stores:
   ```typescript
   import { page } from '$app/stores';
   import { goto } from '$app/navigation';
   ```

## Migration Steps

### 1. Setup Svelte Infrastructure (Immediate)

1. Install Required Dependencies
   ```bash
   npm install @zerodevx/svelte-toast
   ```

2. Create Base Svelte Components
   ```typescript
   // src/lib/components/extensions/ExtensionList.svelte
   // src/lib/components/extensions/ExtensionCard.svelte
   // src/lib/components/extensions/ExtensionManager.svelte
   ```

3. Setup Svelte Stores
   ```typescript
   // src/lib/stores/extensions.ts
   import { writable } from 'svelte/store';
   import type { FullExtensionConfig } from '$lib/types';

   export const extensions = writable<FullExtensionConfig[]>([]);
   ```

### 2. Core Functionality Migration (Immediate)

1. Create Extension Service
   ```typescript
   // src/lib/services/extensions.ts
   export class ExtensionService {
     async addExtension(config: FullExtensionConfig): Promise<void>;
     async removeExtension(name: string): Promise<void>;
     async loadStoredExtensions(): Promise<void>;
   }
   ```

2. Implement Local Storage Wrapper
   ```typescript
   // src/lib/services/storage.ts
   export class StorageService {
     getExtensions(): FullExtensionConfig[];
     saveExtension(config: FullExtensionConfig): void;
     removeExtension(id: string): void;
   }
   ```

### 3. UI Components Implementation (Next Phase)

1. Extension List View
   ```svelte
   <!-- src/lib/components/extensions/ExtensionList.svelte -->
   <script lang="ts">
     import { extensions } from '$lib/stores/extensions';
     import ExtensionCard from './ExtensionCard.svelte';
   </script>

   {#each $extensions as extension (extension.id)}
     <ExtensionCard {extension} />
   {/each}
   ```

2. Extension Management
   ```svelte
   <!-- src/lib/components/extensions/ExtensionManager.svelte -->
   <script lang="ts">
     import { ExtensionService } from '$lib/services/extensions';
     import { toast } from '@zerodevx/svelte-toast';
   </script>
   ```

### 4. Deep Linking Implementation (Final Phase)

1. URL Handler
   ```typescript
   // src/lib/services/url-handler.ts
   export class ExtensionUrlHandler {
     validateUrl(url: string): boolean;
     parseExtensionUrl(url: string): ExtensionConfig;
   }
   ```

2. Integration with Svelte Router
   ```typescript
   // src/routes/extensions/+page.ts
   import { ExtensionUrlHandler } from '$lib/services/url-handler';
   ```

## Testing Strategy

1. Unit Tests
   ```typescript
   // tests/extension-service.test.ts
   describe('ExtensionService', () => {
     it('should add extension', async () => {
       // Test implementation
     });
   });
   ```

2. Integration Tests
   ```typescript
   // tests/extension-integration.test.ts
   describe('Extension Integration', () => {
     it('should handle deep links', async () => {
       // Test implementation
     });
   });
   ```

## Migration Checklist

### Phase 1: Core Infrastructure
- [ ] Setup Svelte project structure
- [ ] Install required dependencies
- [ ] Create basic stores and services
- [ ] Port type definitions

### Phase 2: UI Components
- [ ] Create ExtensionList component
- [ ] Create ExtensionCard component
- [ ] Implement extension management interface
- [ ] Setup toast notifications

### Phase 3: Integration
- [ ] Implement deep linking
- [ ] Add URL handling
- [ ] Setup routing
- [ ] Test IPC communication

### Phase 4: Testing & Cleanup
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Remove React components
- [ ] Update documentation

## Notes

1. Keep Existing Functionality
   - Extension configuration persistence
   - Security validations
   - IPC communication
   - Type safety

2. Svelte Advantages to Leverage
   - Reactive stores for state management
   - Built-in transitions and animations
   - More concise component syntax
   - Better performance characteristics

3. Security Considerations
   - Maintain URL validation
   - Keep command whitelisting
   - Preserve environment variable handling