import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      svgr(),
      compression({ algorithm: "brotliCompress" }),
      visualizer({ open: false }),
    ],
    css: {
      modules: {
        localsConvention: "camelCase",
      },
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    build: {
      minify: "esbuild",
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      manifest: true,
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },
    server: {
      proxy: {
        "/prevgen-api": {
          target: env.VITE_PREVGEN_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/prevgen-api/, "/api"),
        },
      },
    },
  };
});
