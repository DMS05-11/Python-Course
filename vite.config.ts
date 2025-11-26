import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We use '' as the third argument to load ALL env vars, not just those starting with VITE_
  // Fix: Cast process to any to avoid TypeScript error regarding cwd property
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // CRITICAL: This ensures assets use relative paths for GitHub Pages support
    base: './', 
    define: {
      // This is required to make 'process.env.API_KEY' work in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill process.env to prevent "process is not defined" errors in some 3rd party libraries
      'process.env': {},
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    },
  };
});