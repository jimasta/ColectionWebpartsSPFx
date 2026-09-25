import { brazilStates } from './BrazilMapData';

const EXPECTED_UF_COUNT = 27;

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
});
