import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      "/api/websocket": {
        target: "ws://localhost:3001",
        ws: true
      },
      "/api": "http://localhost:3001"
    }
  },
  plugins: [react(), tailwindcss()]
});
