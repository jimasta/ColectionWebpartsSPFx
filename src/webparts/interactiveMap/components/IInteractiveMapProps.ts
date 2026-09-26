import type { IStateLinks } from '../../../models/IStateLinks';

export interface IInteractiveMapProps {
  /** Whether the current SharePoint theme is a dark/inverted variant. */
  isDarkTheme: boolean;
  /** Whether the page is in edit mode. Clicking a state never navigates while editing. */
  isEditMode: boolean;
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
  /** F4: destination link of each state, keyed by UF. */
  stateLinks?: IStateLinks;
  /** F4: open the state links in a new tab instead of the current one. */
  openLinksInNewTab?: boolean;
  /** Opens the property pane, from the "missing links" warning shown in edit mode. */
  onConfigureLinks: () => void;
}
