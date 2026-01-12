import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["jyonl-2600-1700-6a32-450-1552-d1e2-2c39-fde6.a.free.pinggy.link"]
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})

