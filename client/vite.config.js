import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteRestart from "vite-plugin-restart";

export default defineConfig({
  plugins: [
    react(),
    ViteRestart({
      restart: [
        "package.json",
        "node_modules/**"
      ]
    }),
  ],
});
