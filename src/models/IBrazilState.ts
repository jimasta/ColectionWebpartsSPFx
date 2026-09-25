/**
 * Represents a single Brazilian state (UF) as a clickable region of the interactive map.
 * `path` holds the raw SVG path geometry ("d" attribute) extracted from the source map.
 */
export interface IBrazilState {
  /** Two-letter state code (UF), e.g. "SP", "RJ". Used as the SVG element id and as the
   *  property pane key when configuring colors/links per state (F3/F4). */
  uf: string;
  /** Full state name, e.g. "São Paulo". */
  name: string;
  /** SVG path geometry ("d" attribute) for this state's shape. */
  path: string;
}
