import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 300000,
    retry: process.env.CI ? 1 : 0,
    exclude: [...configDefaults.exclude],
    poolOptions: {
      threads: {
        maxThreads: process.env.CI ? undefined : 4,
        minThreads: process.env.CI ? undefined : 4,
      },
    },
  },
  resolve: {
    alias: {
      "#imports": "nuxt",
    },
  },
});
