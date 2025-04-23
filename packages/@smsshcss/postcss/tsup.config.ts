import { defineConfig } from 'tsup';

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
    entry: ['src/index.cts'],
  },
]); 