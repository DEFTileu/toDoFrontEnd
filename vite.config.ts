import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    allowedHosts: ["todofrontend-y9ud.onrender.com"," https://todofrontend-y9ud.onrender.com/login","1ba290bc1b99.ngrok-free.app"], // Разрешаем все хосты
  },
});
