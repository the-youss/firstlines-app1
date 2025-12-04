import { getDomain } from 'tldts';

const DOMAIN_CACHE_MAP = new Map<string, string>();


export function resolveDomain(companyDomain: string): string {
  const cachedDomain = DOMAIN_CACHE_MAP.get(companyDomain);
  if (cachedDomain) {
    return cachedDomain;
  }
  const domain =
    getDomain(companyDomain) || getDomainFromWebsiteUrl(companyDomain);
  DOMAIN_CACHE_MAP.set(companyDomain, domain);
  return domain;
}


export function getDomainFromWebsiteUrl(url: string): string {
  let formatedUrl = url;
  if (!/^https?:\/\//.test(formatedUrl)) {
    formatedUrl = `https://${formatedUrl}`;
  }
  const host = new URL(formatedUrl).host.replace('www.', '');
  return host;
};
