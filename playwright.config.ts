import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import { resolveUseMock } from './src/config/resolve-mock-mode';

dotenv.config();

const apiKey = process.env.REQRES_API_KEY?.trim();
const useMock = resolveUseMock();
const mockPort = process.env.MOCK_REQRES_PORT ?? '3099';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  testDir: './tests',
  timeout: 30_000,
  retries: useMock ? 0 : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: useMock
      ? `http://127.0.0.1:${mockPort}`
      : (process.env.REQRES_BASE_URL ?? 'https://reqres.in'),
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'reqres-playwright-tests/1.0',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
  },
  webServer: useMock
    ? {
        command: `node scripts/mock-reqres-server.mjs`,
        url: `http://127.0.0.1:${mockPort}/api/users/2`,
        reuseExistingServer: !process.env.CI,
        env: { MOCK_REQRES_PORT: mockPort },
      }
    : undefined,
  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
    },
  ],
});
