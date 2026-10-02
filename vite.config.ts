import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { lcpPreload } from './plugins/lcp-preload';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      imagetools(),
      lcpPreload({
        source: 'src/assets/images/hero_child_longing_meal.jpg',
        widths: [640, 960, 1376],
        sizes: '100vw',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) return 'vendor';
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion';
          },
        },
      },
    },
  };
});
