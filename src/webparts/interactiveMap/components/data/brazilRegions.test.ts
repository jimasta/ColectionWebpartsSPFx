import { brazilRegions } from './brazilRegions';
import { brazilStates } from './BrazilMapData';

// F4: every state must get exactly one link field in the property pane. A UF missing from the
// regions would leave that state without any way to configure its (mandatory) link.
describe('brazilRegions', () => {
  const regionUfs = brazilRegions.reduce<string[]>((ufs, region) => ufs.concat(region.ufs), []);

  it('lists each UF only once', () => {
    expect(new Set(regionUfs).size).toBe(regionUfs.length);
  });

  it('covers exactly the 27 states of the map', () => {
    const mapUfs = brazilStates.map((state) => state.uf).sort();
    expect([...regionUfs].sort()).toEqual(mapUfs);
  });
});
