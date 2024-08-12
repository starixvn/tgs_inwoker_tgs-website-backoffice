import { defineConfig, splitVendorChunkPlugin } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  define: {
    "process.env.BUMBAG_ENV": JSON.stringify("")
  },
  publicDir: "public",
  plugins: [
    splitVendorChunkPlugin(),
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        configFile: true
      }
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        }
      }
      /*
      "/trace-api": {
        target: "http://localhost:4318",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trace-api/, "/v1/traces")
      }
      */
    }
  },
  build: {
    target: ["es2020"],
    modulePreload: {
      polyfill: false
    },
    outDir: "build",
    sourcemap: "inline"
  }
})
