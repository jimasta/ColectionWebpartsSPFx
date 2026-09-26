import * as React from 'react';
import styles from './InteractiveMap.module.scss';
import type { IInteractiveMapProps } from './IInteractiveMapProps';
import { brazilStates, BRAZIL_MAP_VIEWBOX } from './data/BrazilMapData';
import * as strings from 'InteractiveMapWebPartStrings';
import type { IBrazilState } from '../../../models/IBrazilState';
import { getMapColorVariables } from './mapColors';
import { getUfsWithoutLink, resolveStateLink } from './stateLinks';

// F2: radius of the callout circle used for states too small/crowded to fit their UF label
// inside their own shape (RN, PB, PE, AL, SE, DF, RJ, ES — see BrazilMapData.ts).
const CALLOUT_RADIUS = 12;

const ALL_UFS: readonly string[] = brazilStates.map((state) => state.uf);

// Edit-mode only, so it's loaded on demand and its Fluent UI code stays out of the bundle every
// page visitor downloads.
const MissingLinksWarning = React.lazy(
  () => import(/* webpackChunkName: 'interactive-map-edit-warning' */ './MissingLinksWarning')
);

function openLink(url: string, newTab: boolean): void {
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.assign(url);
  }
}

/**
 * F1/F2 (docs/backlog/interactive-map.md): renders the Brazil SVG map with all 27 states as
 * clickable regions, each labeled with its UF. States large enough show the label directly
 * over their centroid and are clickable on their own shape; the 8 smallest/most crowded
 * states show the label in a callout circle connected to the state by a line — for those,
 * the callout circle is the clickable element instead of the (too small) state shape, since
 * that's the only element with room for a comfortable click/tap target. Also renders an
 * optional title/subtitle configured via the property pane.
 *
 * F3: the base and hover colors configured in the property pane are exposed as CSS variables
 * on the root element; the stylesheet falls back to the theme colors when they're unset.
 *
 * F4: clicking a state navigates to its configured link (same tab, or a new one if configured).
 * In view mode, a state without a valid link doesn't react to clicks; in edit mode clicks only
 * highlight the state — navigating away would drop the author's unsaved changes — and a warning
 * lists the states still missing a link.
 *
 * The zoom animation before navigating (F6) will run right before `openLink`; F7 (keyboard
 * activation) will need to mirror the same click-target split (state shape vs. callout circle).
 */
const InteractiveMap: React.FC<IInteractiveMapProps> = ({
  isEditMode,
  title,
  subtitle,
  baseColor,
  hoverColor,
  stateLinks,
  openLinksInNewTab,
  onConfigureLinks
}) => {
  const [selectedUf, setSelectedUf] = React.useState<string | undefined>(undefined);

  // Not memoized on purpose: SPFx updates the web part properties in place, so `stateLinks`
  // keeps the same object reference after an edit in the property pane. It's 27 cheap checks.
  const ufsWithoutLink = getUfsWithoutLink(stateLinks, ALL_UFS);

  const isInteractive = (uf: string): boolean =>
    isEditMode || resolveStateLink(stateLinks, uf) !== undefined;

  const handleStateClick = (uf: string): void => {
    setSelectedUf(uf);
    if (isEditMode) {
      return;
    }
    const link = resolveStateLink(stateLinks, uf);
    if (link) {
      openLink(link, openLinksInNewTab === true);
    }
  };

  const renderState = (state: IBrazilState): React.ReactElement => {
    const isSelected = state.uf === selectedUf;
    // States with a callout are too small/crowded for their own shape to be a usable click
    // target — the callout circle (rendered separately, in renderLabel) is the click target
    // for those instead, so the shape itself is purely visual here.
    if (state.calloutPosition) {
      return (
        <path
          key={state.uf}
          d={state.path}
          className={[styles.state, isSelected && styles.selected].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      );
    }

    const interactive = isInteractive(state.uf);
    return (
      <path
        key={state.uf}
        d={state.path}
        className={[styles.state, interactive && styles.clickable, isSelected && styles.selected]
          .filter(Boolean)
          .join(' ')}
        onClick={interactive ? (): void => handleStateClick(state.uf) : undefined}
      >
        <title>{state.name}</title>
      </path>
    );
  };

  const renderLabel = (state: IBrazilState): React.ReactElement => {
    if (state.calloutPosition) {
      const interactive = isInteractive(state.uf);
      return (
        <g key={`${state.uf}-label`} className={styles.callout}>
          <line
            x1={state.centroid.x}
            y1={state.centroid.y}
            x2={state.calloutPosition.x}
            y2={state.calloutPosition.y}
            className={styles.calloutLine}
            aria-hidden="true"
          />
          <circle
            cx={state.calloutPosition.x}
            cy={state.calloutPosition.y}
            r={CALLOUT_RADIUS}
            className={[
              styles.calloutCircle,
              interactive && styles.clickable,
              state.uf === selectedUf && styles.selected
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={interactive ? (): void => handleStateClick(state.uf) : undefined}
          >
            <title>{state.name}</title>
          </circle>
          <text
            x={state.calloutPosition.x}
            y={state.calloutPosition.y}
            className={styles.calloutLabel}
            aria-hidden="true"
          >
            {state.uf}
          </text>
        </g>
      );
    }

    return (
      <text
        key={`${state.uf}-label`}
        x={state.centroid.x}
        y={state.centroid.y}
        className={styles.stateLabel}
        aria-hidden="true"
      >
        {state.uf}
      </text>
    );
  };

  return (
    <section className={styles.interactiveMap} style={getMapColorVariables(baseColor, hoverColor)}>
      {isEditMode && ufsWithoutLink.length > 0 && (
        <React.Suspense fallback={null}>
          <MissingLinksWarning ufs={ufsWithoutLink} onConfigure={onConfigureLinks} />
        </React.Suspense>
      )}
      {title && <h2 className={styles.title}>{title}</h2>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <svg
        className={styles.map}
        viewBox={BRAZIL_MAP_VIEWBOX}
        role="img"
        aria-label={strings.MapAriaLabel}
        xmlns="http://www.w3.org/2000/svg"
      >
        {brazilStates.map(renderState)}
        {brazilStates.map(renderLabel)}
      </svg>
    </section>
  );
};

export default InteractiveMap;
