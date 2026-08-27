import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('react-router-dom') || id.includes('@remix-run')) return 'vendor-router';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
          }
        }
      }
    }
  },
  plugins: [
    tsconfigPaths(), 
    react(), 
    tagger(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Unilinka System',
        short_name: 'Unilinka',
        description: 'Student learning platform',
        theme_color: '#1F4D3A',
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000 // 5 MB
      }
    })
  ],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});