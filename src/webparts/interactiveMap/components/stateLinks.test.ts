import {
  getStateLinkError,
  getUfsWithoutLink,
  isValidStateLink,
  resolveStateLink
} from './stateLinks';

const messages = { required: 'required', invalid: 'invalid' };

// The exact kind of link these tests must prove is rejected, so it's never navigated to.
// eslint-disable-next-line no-script-url
const SCRIPT_URL = 'javascript:alert(1)';

describe('isValidStateLink', () => {
  it.each([
    'https://contoso.com/page',
    'http://intranet.local/area',
    'HTTPS://CONTOSO.COM',
    '/sites/rh/SitePages/sp.aspx',
    '/sites/rh/Shared Documents/relatorio.pdf',
    '  https://contoso.com/with-spaces-around  '
  ])('accepts %s', (link) => {
    expect(isValidStateLink(link)).toBe(true);
  });

  it.each([
    undefined,
    '',
    '   ',
    SCRIPT_URL,
    'ftp://contoso.com/file',
    'mailto:rh@contoso.com',
    'www.contoso.com',
    'sites/rh',
    '//evil.com/page',
    '/\\evil.com/page',
    'https://'
  ])('rejects %p', (link) => {
    expect(isValidStateLink(link)).toBe(false);
  });
});

describe('getStateLinkError', () => {
  it('asks for a link when the field is empty', () => {
    expect(getStateLinkError(undefined, messages)).toBe('required');
    expect(getStateLinkError('  ', messages)).toBe('required');
  });

  it('flags a link in an unsupported format', () => {
    expect(getStateLinkError(SCRIPT_URL, messages)).toBe('invalid');
  });

  it('accepts a valid link', () => {
    expect(getStateLinkError('/sites/sp', messages)).toBe('');
  });
});

describe('resolveStateLink', () => {
  it('returns the trimmed link of the state', () => {
    expect(resolveStateLink({ SP: '  https://contoso.com/sp ' }, 'SP')).toBe('https://contoso.com/sp');
  });

  it('returns undefined when there are no links at all (instances created before F4)', () => {
    expect(resolveStateLink(undefined, 'SP')).toBeUndefined();
  });

  it('never returns an invalid link, so it is never navigated to', () => {
    expect(resolveStateLink({ SP: SCRIPT_URL }, 'SP')).toBeUndefined();
  });
});

describe('getUfsWithoutLink', () => {
  it('lists every UF when no link was configured', () => {
    expect(getUfsWithoutLink(undefined, ['AC', 'SP'])).toEqual(['AC', 'SP']);
  });

  it('lists only the UFs missing a valid link, keeping the given order', () => {
    const links = { AC: 'https://contoso.com/ac', RJ: 'invalid-link' };
    expect(getUfsWithoutLink(links, ['AC', 'RJ', 'SP'])).toEqual(['RJ', 'SP']);
  });
});
