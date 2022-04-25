import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  /*
  root: "public",
  */
  define: {
    "process.env.BUMBAG_ENV": JSON.stringify("")
  },
  publicDir: "public",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        }
      }
    },
    hmr: true
  }
})
