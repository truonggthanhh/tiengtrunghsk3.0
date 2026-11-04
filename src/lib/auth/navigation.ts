export type LearningLanguage = 'mandarin' | 'cantonese';

/** Accept only destinations inside the current language, excluding authentication loops. */
export function safeReturnPath(value: string | null | undefined, language: LearningLanguage, fallback = `/${language}`): string {
  if (!value?.startsWith('/') || value.startsWith('//') || (value.includes('\\') || [...value].some(character => character.charCodeAt(0) < 32))) return fallback;
  try {
    const url = new URL(value, 'https://app.invalid');
    const prefix = `/${language}`;
    if (url.origin !== 'https://app.invalid' || (url.pathname !== prefix && !url.pathname.startsWith(`${prefix}/`))) return fallback;
    if (/\/(login|forgot-password|update-password)\/?$/.test(url.pathname)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return fallback; }
}

/** Remove OAuth credentials while preserving lesson filters, return URLs, and normal anchors. */
export function cleanAuthUrl(value: string): string {
  const url = new URL(value);
  const hash = new URLSearchParams(url.hash.slice(1));
  const hasAuthHash = hash.has('access_token') || hash.has('refresh_token') || hash.has('error_description');
  const hasCode = url.searchParams.has('code');
  if (hasCode) { url.searchParams.delete('code'); url.searchParams.delete('state'); }
  if (hasAuthHash) {
    for (const key of ['access_token', 'refresh_token', 'token_type', 'expires_in', 'expires_at', 'provider_token', 'provider_refresh_token', 'type', 'error', 'error_code', 'error_description']) hash.delete(key);
    url.hash = hash.toString();
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export function isLanguageQuery(key: readonly unknown[], language: LearningLanguage): boolean {
  if (key[0] === 'blog-comments') return key[1] === language;
  return language === 'cantonese' ? key[0] === 'cantonese' : key[0] !== 'cantonese';
}

export function isAuthRouteForLanguage(pathname: string, language: LearningLanguage) {
  return pathname === `/${language}` || pathname.startsWith(`/${language}/`);
}
