import type * as React from 'react';

/**
 * CSS custom properties consumed by InteractiveMap.module.scss. Each one falls back to the
 * SharePoint theme color in the stylesheet (e.g. `var(--mapBaseColor, var(--neutralTertiary))`),
 * so leaving a variable out means "use the theme".
 */
export interface IMapColorVariables extends React.CSSProperties {
  '--mapBaseColor'?: string;
  '--mapHoverColor'?: string;
}

/**
 * F3: turns the colors configured in the property pane into CSS variables for the map.
 * Unset or blank colors are omitted on purpose, so the stylesheet falls back to the theme.
 */
export function getMapColorVariables(baseColor?: string, hoverColor?: string): IMapColorVariables {
  const variables: IMapColorVariables = {};

  if (baseColor?.trim()) {
    variables['--mapBaseColor'] = baseColor.trim();
  }
  if (hoverColor?.trim()) {
    variables['--mapHoverColor'] = hoverColor.trim();
  }

  return variables;
}
