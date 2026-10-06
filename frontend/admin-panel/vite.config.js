import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "brand/symbol-red.svg", "brand/apple-touch-icon.png"],
      manifest: {
        name: "Om Rudra Packers and Movers - Admin",
        short_name: "Om Rudra Admin",
        description: "Mobile Admin Panel & Invoicing for Om Rudra Packers and Movers",
        theme_color: "#1e3a8a",
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/brand/symbol-red-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          { src: "/brand/symbol-red-512.png", sizes: "512x512", type: "image/png" },
          { src: "/brand/app-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/brand/app-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
});
