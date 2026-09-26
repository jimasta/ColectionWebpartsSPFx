export interface IInteractiveMapProps {
  /** Whether the current SharePoint theme is a dark/inverted variant. */
  isDarkTheme: boolean;
  /** Optional title shown above the map. Free text set by whoever configures the web part
   *  on the page; hidden when empty. */
  title?: string;
  /** Optional subtitle shown below the title. Same rules as `title`. */
  subtitle?: string;
  /** F3: fill color of the states, as a CSS color. Falls back to the theme when unset. */
  baseColor?: string;
  /** F3: fill color on hover and for the selected state/callout. Falls back to the theme when
   *  unset. */
  hoverColor?: string;
}
