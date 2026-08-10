import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: new URL('./src/library.ts', import.meta.url).pathname,
      formats: ['es'],
      fileName: 'quno-datepicker',
      cssFileName: 'quno-datepicker',
    },
    rollupOptions: {
      external: [
        'preact',
        'preact/hooks',
        'preact/jsx-runtime',
        'preact/jsx-dev-runtime',
      ],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
});
