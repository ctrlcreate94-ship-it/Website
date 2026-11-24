import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/ParivaarWebsite/",
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3001",
      "/media": "http://127.0.0.1:3001",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        portfolio: resolve(root, "portfolio.html"),
        packages: resolve(root, "packages.html"),
        admin: resolve(root, "admin.html"),
      },
    },
  },
});
