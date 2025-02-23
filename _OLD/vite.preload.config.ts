import path from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
	build: {
		outDir: '.vite/build',
		lib: {
			entry: path.join(__dirname, 'src/main/preload.ts'),
			formats: ['cjs'],
			fileName: () => 'preload.js'
		},
		rollupOptions: {
			external: ['electron']
		},
		sourcemap: 'inline',
		minify: false
	}
});
