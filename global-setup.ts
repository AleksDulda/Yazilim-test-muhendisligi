import { resolveUseMock } from './src/config/resolve-mock-mode';

function globalSetup(): void {
  const hasApiKey = Boolean(process.env.REQRES_API_KEY?.trim());
  const useMock = resolveUseMock();

  if (!hasApiKey) {
    console.warn(
      '[reqres-tests] REQRES_API_KEY tanımlı değil — yerel mock sunucu (POST echo + GET fixture id=2).',
    );
    console.warn('[reqres-tests] Canlı API: .env içinde REQRES_API_KEY (https://app.reqres.in/api-keys)');
  } else if (useMock && process.env.REQRES_USE_MOCK !== 'true') {
    console.warn('[reqres-tests] API key var ancak canlı API erişilemedi — mock moduna geçildi.');
  }
}

export default globalSetup;
