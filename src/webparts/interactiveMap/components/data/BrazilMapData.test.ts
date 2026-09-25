import { brazilStates } from './BrazilMapData';

const EXPECTED_UF_COUNT = 27;

/**
 * Reconstructs the bounding box of an SVG path's absolute coordinates from its "M/m/L/l"
 * commands (the only ones used by this dataset). Used only to sanity-check that each state's
 * centroid falls within its own shape's bounds — a cheap safety net against a centroid
 * calculation regression silently placing a UF label outside its state again.
 */
function boundingBoxOf(d: string): { minX: number; minY: number; maxX: number; maxY: number } {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let i = 0;
  let cmd = '';
  let x = 0;
  let y = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const readNum = (): number => parseFloat(tokens[i++]);

  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[a-zA-Z]$/.test(t)) {
      cmd = t;
      i++;
    }
    switch (cmd) {
      case 'M':
      case 'L':
        x = readNum();
        y = readNum();
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        cmd = 'L';
        break;
      case 'm':
      case 'l':
        x += readNum();
        y += readNum();
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        cmd = 'l';
        break;
      case 'z':
      case 'Z':
        break;
      default:
        i++;
        break;
    }
  }

  return { minX, minY, maxX, maxY };
}

// F2: validates that every Brazilian state has a UF label position, so a data-entry mistake
// (missing centroid, duplicated UF, etc.) fails the build instead of silently rendering an
// unlabeled state.
describe('BrazilMapData', () => {
  it('has exactly 27 states', () => {
    expect(brazilStates).toHaveLength(EXPECTED_UF_COUNT);
  });

  it('has no duplicated UF', () => {
    const ufs = brazilStates.map((state) => state.uf);
    expect(new Set(ufs).size).toBe(EXPECTED_UF_COUNT);
  });

  it('every state has a non-empty uf, name and path', () => {
    for (const state of brazilStates) {
      expect(state.uf).toMatch(/^[A-Z]{2}$/);
      expect(state.name.length).toBeGreaterThan(0);
      expect(state.path.length).toBeGreaterThan(0);
    }
  });

  it('every state has a valid centroid used to place its UF label', () => {
    for (const state of brazilStates) {
      expect(Number.isFinite(state.centroid.x)).toBe(true);
      expect(Number.isFinite(state.centroid.y)).toBe(true);
    }
  });

  it('every callout position, when set, is a valid point', () => {
    const withCallout = brazilStates.filter((state) => state.calloutPosition !== undefined);
    expect(withCallout.length).toBeGreaterThan(0);
    for (const state of withCallout) {
      expect(Number.isFinite(state.calloutPosition?.x)).toBe(true);
      expect(Number.isFinite(state.calloutPosition?.y)).toBe(true);
    }
  });

  it('every centroid falls within its own state\'s bounding box', () => {
    for (const state of brazilStates) {
      const { minX, minY, maxX, maxY } = boundingBoxOf(state.path);
      expect(state.centroid.x).toBeGreaterThanOrEqual(minX);
      expect(state.centroid.x).toBeLessThanOrEqual(maxX);
      expect(state.centroid.y).toBeGreaterThanOrEqual(minY);
      expect(state.centroid.y).toBeLessThanOrEqual(maxY);
    }
  });

  // F2/F4: InteractiveMap.tsx derives its click target directly from calloutPosition — a
  // state WITH calloutPosition is clicked on the callout circle, a state WITHOUT it is
  // clicked on its own shape. This test pins down exactly which 8 states must use the
  // callout as click target, so a data change here can't silently break that split without
  // the test failing.
  it('has exactly the expected 8 states using the callout as click target', () => {
    const EXPECTED_CALLOUT_UFS = ['RN', 'PB', 'PE', 'AL', 'SE', 'DF', 'RJ', 'ES'];
    const actualCalloutUfs = brazilStates
      .filter((state) => state.calloutPosition !== undefined)
      .map((state) => state.uf)
      .sort();
    expect(actualCalloutUfs).toEqual([...EXPECTED_CALLOUT_UFS].sort());
  });
});
