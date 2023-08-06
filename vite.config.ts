import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss(), postcssNesting()],
    },
  },
  server: {
    port: 3000,
  }
});