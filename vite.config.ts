import preact from '@preact/preset-vite';
import { defineConfig } from 'vitest/config';

const externals = [
  'preact', 'preact/hooks', 'preact/jsx-runtime', 'preact/jsx-dev-runtime',
];

const libraryBuild = {
  lib: {
    entry: new URL('./src/library.ts', import.meta.url).pathname,
    formats: ['es' as const],
    fileName: 'quno-datepicker',
    cssFileName: 'quno-datepicker',
  },
  rollupOptions: {
    external: externals,
  },
};

const dateInputBuild = {
  emptyOutDir: false,
  lib: {
    entry: new URL('./src/date-input.ts', import.meta.url).pathname,
    formats: ['es' as const],
    fileName: 'date-input',
    cssFileName: 'date-input',
  },
  rollupOptions: libraryBuild.rollupOptions,
};

export default defineConfig(({ mode }) => ({
  plugins: [preact()],
  build: mode === 'demo'
    ? { outDir: 'demo-dist' }
    : mode === 'date-input' ? dateInputBuild : libraryBuild,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
}));
