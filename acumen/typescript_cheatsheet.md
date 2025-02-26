# TypeScript Cheat Sheet for Goose Project

## Balanced TypeScript Approach

This guide provides practical examples of when to use different levels of typing in our project.

## When to Use Strict Typing

Use comprehensive typing in these scenarios:

1. **Public APIs and Interfaces**

   ```typescript
   // Good: Clear interface for IPC communication
   interface NotificationOptions {
   	title: string;
   	body: string;
   	type?: 'info' | 'warning' | 'error';
   	timeout?: number;
   }
   ```

2. **Complex Data Structures**

   ```typescript
   // Good: Type for complex nested data
   interface ExtensionConfig {
   	id: string;
   	name: string;
   	version: string;
   	settings: {
   		enabled: boolean;
   		options: Record<string, unknown>;
   	};
   }
   ```

3. **Function Parameters and Return Types**
   ```typescript
   // Good: Clear contract for function behavior
   function createWindow(options: WindowOptions): Promise<BrowserWindow> {
   	// Implementation
   }
   ```

## When to Use Lighter Typing

These scenarios benefit from simpler typing approaches:

1. **Implementation Details and Private Functions**

   ```typescript
   // Good: Simple typing for internal helper
   function formatLogMessage(message: string, level = 'info') {
   	// Implementation
   }
   ```

2. **Simple Objects with Obvious Structure**

   ```typescript
   // Good: Type inference works well here
   const config = {
   	width: 800,
   	height: 600,
   	resizable: true
   };
   ```

3. **When Using Type Inference**

   ```typescript
   // Good: Let TypeScript infer the array type
   const supportedFormats = ['jpg', 'png', 'gif'];

   // Instead of:
   const supportedFormats: string[] = ['jpg', 'png', 'gif'];
   ```

## Practical Type Shortcuts

1. **Use `type` for Unions and Simple Types**

   ```typescript
   type NotificationType = 'info' | 'warning' | 'error';
   type ID = string;
   ```

2. **Use Partial for Optional Updates**

   ```typescript
   function updateSettings(id: string, updates: Partial<Settings>) {
   	// Implementation
   }
   ```

3. **Use Record for Dynamic Properties**

   ```typescript
   type ConfigOptions = Record<string, unknown>;
   ```

4. **Use Type Assertions Sparingly**
   ```typescript
   // Only when you know better than TypeScript
   const element = document.getElementById('app') as HTMLDivElement;
   ```

## Type Discovery Tips for AI Assistants

1. **Reference the Type Reference File**

   ```typescript
   // Check desktop/goose-desktop/src/type_reference.ts for common types
   ```

2. **Look for Type Patterns**

   - `.types.ts` files contain type definitions
   - `.d.ts` files contain declarations
   - Types are usually in PascalCase

3. **Check Import Statements**

   - Look at imports in similar files to find relevant types

4. **Use Type-Only Imports**
   ```typescript
   import type { WindowOptions } from '../types/window.types';
   ```

## When to Skip Typing

It's reasonable to skip extensive typing in these cases:

1. **Temporary or Prototype Code**

   ```typescript
   // Quick prototype - add types later
   function quickTest() {
   	const result = fetchData();
   	console.log(`Line 42 - test.ts - 'result': `, result);
   }
   ```

2. **When Types Are Obvious from Context**

   ```typescript
   // Type inference works well here
   const isEnabled = true;
   const count = 5;
   ```

3. **Simple Event Handlers**
   ```typescript
   // Simple event handler
   button.addEventListener('click', () => {
   	toggleMenu();
   });
   ```

## Project-Specific Type Locations

- **IPC Types**: `desktop/goose-desktop/src/main/main_ipc/types/`
- **Electron Types**: `desktop/goose-desktop/src/main/types/electron/`
- **Generated Types**: `desktop/goose-desktop/src/api/generated/`
- **Type Reference**: `desktop/goose-desktop/src/type_reference.ts`
