import * as React from 'react';
import styles from './InteractiveMap.module.scss';
import type { IInteractiveMapProps } from './IInteractiveMapProps';
import { brazilStates, BRAZIL_MAP_VIEWBOX } from './data/BrazilMapData';
import * as strings from 'InteractiveMapWebPartStrings';
import type { IBrazilState } from '../../../models/IBrazilState';

// F2: radius of the callout circle used for states too small/crowded to fit their UF label
// inside their own shape (RN, PB, PE, AL, SE, DF, RJ, ES — see BrazilMapData.ts).
const CALLOUT_RADIUS = 12;

/**
 * F1/F2 (docs/backlog/interactive-map.md): renders the Brazil SVG map with all 27 states as
 * clickable regions, each labeled with its UF. States large enough show the label directly
 * over their centroid; the 5 smallest states show it in a callout circle connected to the
 * state by a line, to stay readable. Also renders an optional title/subtitle configured via
 * the property pane. Colors (F3), per-state links (F4), the zoom animation before navigating
 * (F6) and keyboard activation (F7) are intentionally out of scope here and build on top of
 * this component in later branches.
 */
const InteractiveMap: React.FC<IInteractiveMapProps> = ({ title, subtitle }) => {
  // Placeholder handler for F1: proves each state is an individually clickable/selectable
  // element. F6 will replace this with the zoom animation + navigation to the state's link.
  const [selectedUf, setSelectedUf] = React.useState<string | undefined>(undefined);

  const handleStateClick = (uf: string): void => {
    setSelectedUf(uf);
  };

  const renderLabel = (state: IBrazilState): React.ReactElement => {
    if (state.calloutPosition) {
      return (
        <g key={`${state.uf}-label`} className={styles.callout} aria-hidden="true">
          <line
            x1={state.centroid.x}
            y1={state.centroid.y}
            x2={state.calloutPosition.x}
            y2={state.calloutPosition.y}
            className={styles.calloutLine}
          />
          <circle
            cx={state.calloutPosition.x}
            cy={state.calloutPosition.y}
            r={CALLOUT_RADIUS}
            className={styles.calloutCircle}
          />
          <text
            x={state.calloutPosition.x}
            y={state.calloutPosition.y}
            className={styles.calloutLabel}
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
    <section className={styles.interactiveMap}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <svg
        className={styles.map}
        viewBox={BRAZIL_MAP_VIEWBOX}
        role="img"
        aria-label={strings.MapAriaLabel}
        xmlns="http://www.w3.org/2000/svg"
      >
        {brazilStates.map((state) => (
          <path
            key={state.uf}
            d={state.path}
            className={state.uf === selectedUf ? `${styles.state} ${styles.selected}` : styles.state}
            onClick={(): void => handleStateClick(state.uf)}
          >
            <title>{state.name}</title>
          </path>
        ))}
        {brazilStates.map(renderLabel)}
      </svg>
    </section>
  );
};

export default InteractiveMap;
