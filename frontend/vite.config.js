import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production optimizations
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Code splitting for optimal caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-data': ['axios', '@tanstack/react-query', 'socket.io-client'],
        },
      },
    },
    // Performance
    chunkSizeWarningLimit: 500,
    sourcemap: false,
  },
  server: {
    host: true,
    port: 5173,
  },
});
