import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: clientRoot,
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
  build: {
    outDir: path.resolve(clientRoot, "../dist"),
    emptyOutDir: true,
  },
});
