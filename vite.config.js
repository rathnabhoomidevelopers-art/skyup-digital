import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import path from "path";

export default defineConfig({
  plugins: [vike({ prerender: true }), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
    cssCodeSplit: true, // was false — this was causing one giant CSS bundle
    cssMinify: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/framer-motion")) return "framer-motion";
          if (id.includes("node_modules/react-dom")) return "react-dom";
          if (id.includes("node_modules/react/")) return "react";
          if (
            id.includes("node_modules/formik") ||
            id.includes("node_modules/yup")
          )
            return "forms";
          // ✅ Add this — splits the heavy receipt page
          if (
            id.includes("node_modules/html2canvas") ||
            id.includes("node_modules/jspdf")
          )
            return "pdf-libs";
        },
        // ✅ Stable filenames for better caching
        chunkFileNames: "static/js/[name].[hash].js",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development",
    ),
  },
  esbuild: {
    loader: "jsx",
    include: /.*\.[jt]sx?$/,
    exclude: [],
    // ✅ Remove console.log in production
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
      },
    },
  },
});
