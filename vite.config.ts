/*
 * @Author: shufei.han
 * @Date: 2024-10-15 10:42:00
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-11-06 15:09:50
 * @FilePath: \kvm-web-vue3\vite.config.ts
 * @Description: 
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api/ws': {
        target: 'wss://192.168.8.240',
        changeOrigin: true,
        secure:false
      },
      '/janus/ws': {
        target: 'wss://192.168.8.240',
        changeOrigin: true,
        secure:false
      },
      '/api': {
        target: 'https://192.168.8.240',
        changeOrigin: true,
        secure:false
      },
      '/stream': {
        target: 'https://192.168.8.240',
        changeOrigin: true,
        secure:false
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
