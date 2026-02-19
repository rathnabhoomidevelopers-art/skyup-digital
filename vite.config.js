import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default defineConfig({
  plugins: [
    vike({ prerender: true }),  // ← add prerender here too
    react(),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    cssCodeSplit: false,
    cssMinify: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
      },
    },
  },
})