import * as React from 'react';
import styles from './InteractiveMap.module.scss';
import type { IInteractiveMapProps } from './IInteractiveMapProps';
import { brazilStates, BRAZIL_MAP_VIEWBOX } from './data/BrazilMapData';
import * as strings from 'InteractiveMapWebPartStrings';

/**
 * F1 (docs/backlog/interactive-map.md): renders the Brazil SVG map with all 27 states as
 * clickable regions, plus an optional title/subtitle configured via the property pane.
 * Colors (F3), per-state links (F4), the zoom animation before navigating (F6) and keyboard
 * activation (F7) are intentionally out of scope here and build on top of this component in
 * later branches.
 */
const InteractiveMap: React.FC<IInteractiveMapProps> = ({ title, subtitle }) => {
  // Placeholder handler for F1: proves each state is an individually clickable/selectable
  // element. F6 will replace this with the zoom animation + navigation to the state's link.
  const [selectedUf, setSelectedUf] = React.useState<string | undefined>(undefined);

  const handleStateClick = (uf: string): void => {
    setSelectedUf(uf);
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
      </svg>
    </section>
  );
};

export default InteractiveMap;
