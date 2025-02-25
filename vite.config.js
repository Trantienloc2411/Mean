import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Tự động mở trình duyệt
  },
  resolve: {
    alias: {
      leaflet: "leaflet/dist/leaflet.js",
    },
  },
});
