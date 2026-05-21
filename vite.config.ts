import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import pkg from "./package.json";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_DESCRIPTION__: JSON.stringify(pkg.description),
    __APP_AUTHOR__: JSON.stringify(pkg.author.name),
    __APP_AUTHOR_GITHUB__: JSON.stringify(pkg.author.github),
    __APP_LICENSE__: JSON.stringify(pkg.license),
    __APP_REPOSITORY__: JSON.stringify(pkg.repository.url),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/marked")) return "marked";
        },
      },
    },
  },
});
