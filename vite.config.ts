import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    hmr: {
      timeout: 30000, // Increase timeout to 30 seconds
      clientPort: 443
    }
  },
  preview: {
    port: 3000,
    strictPort: false,
    host: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  optimizeDeps: {
    include: [
      'chart.js',
      'react-chartjs-2',
      'react-icons',
      '@heroicons/react/24/outline',
      '@headlessui/react',
      'react-router-dom',
      'formik',
      'yup',
      '@tiptap/react',
      '@tiptap/starter-kit',
      'date-fns'
    ]
  }
})