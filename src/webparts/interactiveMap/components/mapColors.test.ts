import { getMapColorVariables } from './mapColors';

// F3: the map must fall back to the theme whenever a color isn't configured — including
// web part instances created before F3 existed, which receive `undefined` for both colors.
describe('getMapColorVariables', () => {
  it('returns no variables when no color is configured, so the theme is used', () => {
    expect(getMapColorVariables(undefined, undefined)).toEqual({});
  });

  it('treats blank colors as not configured', () => {
    expect(getMapColorVariables('', '   ')).toEqual({});
  });

  it('sets both variables when both colors are configured', () => {
    expect(getMapColorVariables('#107c10', '#004b1c')).toEqual({
      '--mapBaseColor': '#107c10',
      '--mapHoverColor': '#004b1c'
    });
  });

  it('sets only the configured color and leaves the other one to the theme', () => {
    expect(getMapColorVariables(undefined, '#004b1c')).toEqual({ '--mapHoverColor': '#004b1c' });
  });
});
