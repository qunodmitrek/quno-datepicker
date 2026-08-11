import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

const libraryBuild = {
  lib: {
    entry: new URL('./src/library.ts', import.meta.url).pathname,
    formats: ['es' as const],
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
};

export default defineConfig(({ mode }) => ({
  plugins: [preact()],
  build: mode === 'demo' ? { outDir: 'demo-dist' } : libraryBuild,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
}));
