import { defineConfig } from 'tsup';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig([
  {
    format: ['esm'],
    minify: true,
    cjsInterop: true,
    dts: false,
    entry: ['src/index.ts'],
  },
  {
    format: ['cjs'],
    minify: true,
    cjsInterop: true,
    dts: false,
    entry: ['src/index.ts'],
  },
]);
