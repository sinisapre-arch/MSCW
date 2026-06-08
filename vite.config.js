import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Changed from '/' to './' to support GitHub Pages subfolders
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    open: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 4180,
    strictPort: true,
  },
});
