import { resolve } from 'path';
import { defineConfig } from 'vite';

// import { sveltekit } from '@sveltejs/kit/vite';
// import tailwindcss from '@tailwindcss/vite';

const sourcePath = resolve(__dirname, '../../apps/shad_starter');

console.log('Line 7 - vite.renderer.config.ts - sourcePath', sourcePath);

// https://vitejs.dev/config
export default defineConfig({
	root: sourcePath,
	base: ''
});
// plugins: [sveltekit(), tailwindcss()]
