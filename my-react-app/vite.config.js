import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/metal-rates": {
        target: "https://demos.zarpsoftware.in",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/metal-rates/, "/goldapp/mobile/metal-rates"),
        secure: false,
      },
    },
  },
})
