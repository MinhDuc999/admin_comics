import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '8917-1-55-255-15.ngrok-free.app',
      'ae54-1-55-255-15.ngrok-free.app',
    ],
  },
});
