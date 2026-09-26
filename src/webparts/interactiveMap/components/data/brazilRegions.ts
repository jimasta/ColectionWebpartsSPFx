export type BrazilRegionKey = 'north' | 'northeast' | 'centralWest' | 'southeast' | 'south';

export interface IBrazilRegion {
  key: BrazilRegionKey;
  /** UFs of the region, ordered by state name (the order shown in the property pane). */
  ufs: readonly string[];
}

/**
 * F4: the five Brazilian regions, used to group the 27 link fields in the property pane so the
 * author can find a state quickly. Region names are UI text and live in the loc files.
 */
export const brazilRegions: readonly IBrazilRegion[] = [
  { key: 'north', ufs: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'] },
  { key: 'northeast', ufs: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'] },
  { key: 'centralWest', ufs: ['DF', 'GO', 'MT', 'MS'] },
  { key: 'southeast', ufs: ['ES', 'MG', 'RJ', 'SP'] },
  { key: 'south', ufs: ['PR', 'RS', 'SC'] }
];
