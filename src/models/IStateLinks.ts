/**
 * F4: destination link of each state, keyed by UF (e.g. `{ SP: 'https://...', RJ: '/sites/rj' }`).
 * Stored in the web part property `stateLinks`; web part instances created before F4 have no
 * value at all, and a state may still be missing from the object while the author is filling
 * the links in.
 */
export interface IStateLinks {
  [uf: string]: string | undefined;
}
