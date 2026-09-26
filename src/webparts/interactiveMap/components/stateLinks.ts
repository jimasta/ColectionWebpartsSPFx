import type { IStateLinks } from '../../../models/IStateLinks';

// Used only to resolve server-relative links while validating them; never navigated to.
const VALIDATION_HOST = 'validation.invalid';

function parseUrl(value: string, base?: string): URL | undefined {
  try {
    return new URL(value, base);
  } catch {
    return undefined;
  }
}

/**
 * F4: a state link must be either an absolute http(s) URL or a server-relative path in the
 * current tenant (e.g. `/sites/rh/SitePages/sp.aspx`). Anything else — `javascript:`, other
 * schemes, protocol-relative `//host` — is rejected, since the link is navigated to on click.
 */
export function isValidStateLink(value: string | undefined): boolean {
  const link = value?.trim();
  if (!link) {
    return false;
  }

  if (/^https?:\/\//i.test(link)) {
    const url = parseUrl(link);
    return url !== undefined && url.hostname.length > 0;
  }

  if (link.startsWith('/') && !link.startsWith('//')) {
    // Browsers read "/\host" as "//host" (another site). Resolving against a known host and
    // checking it's unchanged catches that and similar tricks.
    const url = parseUrl(link, `https://${VALIDATION_HOST}`);
    return url !== undefined && url.hostname === VALIDATION_HOST;
  }

  return false;
}

export interface IStateLinkMessages {
  required: string;
  invalid: string;
}

/** Property pane validation: returns '' when the link is valid, or the message to show. */
export function getStateLinkError(value: string | undefined, messages: IStateLinkMessages): string {
  if (!value?.trim()) {
    return messages.required;
  }
  return isValidStateLink(value) ? '' : messages.invalid;
}

/** The link to navigate to for a state, or undefined when it's missing or not valid. */
export function resolveStateLink(links: IStateLinks | undefined, uf: string): string | undefined {
  const link = links?.[uf]?.trim();
  return link && isValidStateLink(link) ? link : undefined;
}

/** UFs that have no valid link yet, in the order given. */
export function getUfsWithoutLink(links: IStateLinks | undefined, ufs: readonly string[]): string[] {
  return ufs.filter((uf) => resolveStateLink(links, uf) === undefined);
}
