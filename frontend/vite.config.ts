

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// Correction: path import should be from 'path' module, not react-router-dom
import { resolve } from "path"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        chunkSizeWarningLimit: 900,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom", "react-router-dom"],
                    motion: ["framer-motion"],
                    charts: ["recharts", "d3-scale", "react-simple-maps"],
                    query: ["@tanstack/react-query", "axios"],
                },
            },
        },
    },
    server: {
        host: "0.0.0.0",
        port: 5173,
        watch: {
            usePolling: true,
        }
    }
})
