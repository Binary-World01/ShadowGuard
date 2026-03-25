import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const sharedConfig = {
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [{ src: 'public/manifest.json', dest: '.' }]
    })
  ]
}

export default defineConfig(() => {
  // We return a single config that uses rollupOptions to handle the different formats if possible,
  // or we use a more standard extension-friendly approach.
  return {
    ...sharedConfig,
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/popup/index.html'),
          background: resolve(__dirname, 'src/background/main.ts'),
          content: resolve(__dirname, 'src/content/index.ts')
        },
        output: {
          format: 'es', 
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
              return 'assets/[name].js'
            }
            return 'assets/[name]-[hash].js'
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              if (assetInfo.name.includes('content')) return 'assets/content.css'
              if (assetInfo.name.includes('popup')) return 'assets/popup.css'
            }
            return 'assets/[name]-[hash].[ext]'
          }
        }
      }
    }
  }
})
