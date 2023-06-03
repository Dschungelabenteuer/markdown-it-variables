import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  esbuildOptions(options) {
    options.logOverride = {
      ...options.logOverride,
      'empty-import-meta': 'silent',
    };
  },
});
