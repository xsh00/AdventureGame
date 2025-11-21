import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [
    vue(),
    // 单文件打包插件 - 将所有资源内联到一个HTML文件中
    viteSingleFile()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  },
  build: {
    // 单文件打包的推荐配置
    target: 'esnext',
    assetsInlineLimit: 100000000, // 内联所有资源，不论大小
    chunkSizeWarningLimit: 100000000,
    rollupOptions: {
      output: {
        // 确保所有内容都内联，不生成单独的chunk
        inlineDynamicImports: true
      }
    }
  },
  // 使用相对路径
  base: './'
})
