export interface IInteractiveMapProps {
  /** Whether the current SharePoint theme is a dark/inverted variant. */
  isDarkTheme: boolean;
  /** Optional title shown above the map. Free text set by whoever configures the web part
   *  on the page; hidden when empty. */
  title?: string;
  /** Optional subtitle shown below the title. Same rules as `title`. */
  subtitle?: string;
}
