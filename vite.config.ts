import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Temporarily disable lovable-tagger to fix Three.js mesh component error
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Temporarily disable lovable-tagger to fix Three.js mesh component error
    // mode === 'development' &&
    // componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
