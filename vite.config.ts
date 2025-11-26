import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: This ensures assets use relative paths (e.g., "script.js" instead of "/script.js")
  build: {
    outDir: 'dist',
  },
});