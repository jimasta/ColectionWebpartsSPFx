/** A 2D point in the map's SVG coordinate space. */
export interface IMapPoint {
  x: number;
  y: number;
}

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
  /** Approximate centroid of the state's shape, used to place the UF label (F2). */
  centroid: IMapPoint;
  /**
   * Fixed position for a callout label, used only by states too small to fit their UF
   * label inside their own shape (F2). When set, the label is drawn as a circle at this
   * point, connected to the state's centroid by a line, instead of directly over the state.
   */
  calloutPosition?: IMapPoint;
}
