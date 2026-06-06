import dns from 'node:dns';

let cachedUseMock: boolean | undefined;
let dnsFallbackWarned = false;

function canResolveHost(baseUrl: string): boolean {
  const host = new URL(baseUrl).hostname;
  try {
    dns.lookupSync(host, { family: 4 });
    return true;
  } catch {
    try {
      dns.lookupSync(host);
      return true;
    } catch {
      return false;
    }
  }
}

/** Yerel mock mu, canlı Reqres API mi kullanılacak? */
export function resolveUseMock(): boolean {
  if (cachedUseMock !== undefined) return cachedUseMock;

  if (process.env.REQRES_USE_MOCK === 'true') {
    cachedUseMock = true;
    return cachedUseMock;
  }

  const apiKey = process.env.REQRES_API_KEY?.trim();
  if (!apiKey) {
    cachedUseMock = true;
    return cachedUseMock;
  }

  if (process.env.REQRES_STRICT_LIVE === 'true') {
    cachedUseMock = false;
    return cachedUseMock;
  }

  const baseUrl = process.env.REQRES_BASE_URL ?? 'https://reqres.in';
  if (!canResolveHost(baseUrl)) {
    if (!dnsFallbackWarned) {
      dnsFallbackWarned = true;
      console.warn(
        `[reqres-tests] "${new URL(baseUrl).hostname}" çözülemedi (DNS) — yerel mock sunucu kullanılıyor.`,
      );
      console.warn('[reqres-tests] Canlı API zorunluysa: REQRES_STRICT_LIVE=true ve ağ/DNS kontrolü.');
    }
    cachedUseMock = true;
    return cachedUseMock;
  }

  cachedUseMock = false;
  return cachedUseMock;
}
