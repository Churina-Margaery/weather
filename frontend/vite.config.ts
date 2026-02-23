/// <reference types='vitest' />
/// <reference types='vite/client' />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    reporters: ['default', 'html', 'json'],
    outputFile: {
      html: './test-results/html/index.html',
      json: './test-results/results.json',
    },
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'html', 'json', 'lcov', 'text-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/types/**',
        'src/**/mocks/**',
        'src/**/*.d.ts',
        'src/vite-env.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
});