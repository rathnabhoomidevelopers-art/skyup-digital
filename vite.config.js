import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default defineConfig({
  plugins: [
    vike(),
    react(),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    cssCodeSplit: false,    // ✅ Extract ALL CSS into one file loaded in <head> before JS
    cssMinify: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  ssr: {
    noExternal: ['react-helmet-async', 'react-router-dom', 'react-router'],
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