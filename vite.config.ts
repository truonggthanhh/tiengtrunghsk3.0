import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Add entryFileNames to force new hashes
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Manual chunks for better code splitting
        manualChunks: (id) => {
          // Only split vendor chunks - let Vite handle app code splitting automatically
          if (id.includes("node_modules")) {
            // React ecosystem
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "vendor-react";
            }
            // UI libraries
            if (id.includes("@radix-ui") || id.includes("lucide-react")) {
              return "vendor-ui";
            }
            // Supabase
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            // Google Generative AI
            if (id.includes("@google/generative-ai")) {
              return "vendor-google-ai";
            }
            // Other large dependencies
            if (id.includes("framer-motion")) {
              return "vendor-framer";
            }
            if (id.includes("hanzi-writer") || id.includes("pinyin-pro")) {
              return "vendor-chinese-tools";
            }
            if (id.includes("recharts")) {
              return "vendor-charts";
            }
            // All other vendor code
            return "vendor-misc";
          }
          // App code will be split automatically by Vite based on lazy imports
        },
      },
    },
  },
}));
