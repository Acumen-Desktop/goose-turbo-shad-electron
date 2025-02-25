# IPC Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank Window with No Content

If the window loads but shows no content:

- Check if the Vite dev server is running (should see output in terminal)
- Verify the dev server URL in logs matches the actual server port
- Check the renderer config has correct `root` and `entry` paths
- Ensure `index.html` contains proper script imports

### 2. IPC Not Working (No Response)

If the window loads but IPC calls don't work:

- Check the preload script path in console logs
- Verify preload script is being built (check `.vite/build/preload/`)
- Ensure preload config has correct `outDir` and `formats`
- Check DevTools console for any script loading errors
- Verify IPC channel names match between main and renderer

### 3. Build Issues

Common build problems and solutions:

- "Could not resolve entry module": Check Vite configs have explicit entry points
- Missing preload script: Ensure build order is correct and paths match
- Path resolution issues: Use `process.cwd()` for runtime paths, `__dirname` for build time

### 4. Development Setup

For proper development environment:

1. Ensure all three Vite configs are properly set up:

   - `vite.main.config.ts` - Main process
   - `vite.preload.config.ts` - Preload script
   - `vite.renderer.config.ts` - Renderer process

2. Verify forge config has all components:
   ```javascript
   plugins: [
     new VitePlugin({
       build: [
         { entry: 'src/main/main.ts', ... },
         { entry: 'src/main/preload.ts', ... }
       ],
       renderer: [
         {
           name: 'main_window',
           config: 'vite.renderer.config.ts',
           entry: 'src/renderer/index.html'
         }
       ]
     })
   ]
   ```

### 5. Debugging Steps

When troubleshooting:

1. Clean build directories: `rm -rf .vite dist`
2. Check build output in `.vite/build/`
3. Verify file paths in logs
4. Use DevTools to check for script loading errors
5. Add console logs in preload script to verify loading
6. Check IPC channel registration and event names

### 6. Path Resolution

Common path patterns:

- Runtime paths (like preload script): `process.cwd()`
- Build time paths: `__dirname`
- Dev server paths: Relative to Vite config root
- Production paths: Relative to app root

### 7. Environment Variables

Important environment variables:

- `NODE_ENV`: Affects build behavior
- `ELECTRON_APP_URL`: Optional external app URL
- `MAIN_WINDOW_VITE_DEV_SERVER_URL`: Dev server URL
- `MAIN_WINDOW_VITE_NAME`: Window name for production

## Reference

For more details, see:

- [IPC Reference](./IPC.md)
- [Electron IPC Guide](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Electron Forge Vite Config](https://www.electronforge.io/config/plugins/vite)
