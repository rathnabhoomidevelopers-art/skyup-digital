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
    cssCodeSplit: true,
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
          if (
            id.includes("node_modules/html2canvas") ||
            id.includes("node_modules/jspdf")
          )
            return "pdf-libs";
          if (id.includes("node_modules/lucide-react")) return "lucide";
          if (id.includes("node_modules/@mui")) return "mui";
          if (id.includes("node_modules/@emotion")) return "emotion";
        },
        chunkFileNames: "static/js/[name].[hash].js",
      },
    },
  },
  ssr: {
    noExternal: [],
    external: ["picocolors", "@brillout/picocolors"],
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