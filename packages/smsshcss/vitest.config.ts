import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/types.ts',
      ],
    },
  },
});
