import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Uploaded originals can be locked while being copied on Windows.
      // Continue watching the actual assets under public and source under src.
      ignored: (filePath) => {
        const path = filePath.replace(/\\/g, "/");
        return /\/(tmp|preview)(\/|$)/.test(path)
          || (/\.(png|jpe?g|webp|pdf)$/i.test(path) && !/\/(public|src)\//.test(path));
      },
    },
  },
});
