import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    compression({ algorithm: 'brotliCompress' }),
    visualizer({ open: false }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    minify: 'esbuild',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
