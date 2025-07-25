import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/uploads': {
        target: 'https://task-flow-spring-boot-a7b12abc3f71.herokuapp.com/',
        changeOrigin: true,
      }
    },
    allowedHosts: ["todofrontend-y9ud.onrender.com"," https://todofrontend-y9ud.onrender.com/login"], // Разрешаем все хосты
  },
});
