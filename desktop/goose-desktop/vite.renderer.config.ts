import path from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
	root: path.join(__dirname, 'src/renderer'),
	base: './',
	build: {
		outDir: '../../dist',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				index: path.join(__dirname, 'src/renderer/index.html')
			}
		}
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	clearScreen: false // Don't clear console to preserve error messages
});
