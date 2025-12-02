export function parseUrlHashParams(url: string): Record<string, string> {
  const hashPart = url.split('#')[1];
  if (!hashPart) return {};
  const [, queryString] = hashPart.split('?');
  return Object.fromEntries(new URLSearchParams(queryString));
}

export function parseProfileHash(url: string): string {
  const parts = new URL(url).pathname.split('/');
  return parts[parts.length - 1];
}
