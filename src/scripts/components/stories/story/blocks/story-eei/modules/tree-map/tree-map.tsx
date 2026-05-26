import { useState } from "react";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../base-scroll/module/scroll-module";
import TreeMapGrid from "./tree-map-grid/tree-map-grid";

import styles from "./tree-map.module.css";

export default function TreeMapModule() {
  const { module, getRefCallback } = useModuleContent();
  const [highlightedLayerId, setHighlightedLayerId] = useState<string | null>(
    null,
  );

  if (!("data" in module)) {
    return;
  }

  const highlightedData = module.data.find(
    ({ layerId }) => layerId === highlightedLayerId,
  );

  const description = highlightedData
    ? `Although the ${highlightedData.label} covers ${highlightedData.percentage.globe}% of Earth's surface, it absorbs ${highlightedData.percentage.grid}% of the incoming energy.`
    : null;

  return (
    <ScrollModule lengthFactor={module.lengthFactor} config={null}>
      <ScrollModule.StickyContainer
        ref={getRefCallback(0, 0)}
        className={styles.slide}
      >
        {highlightedData && description && (
          <>
            <h1 className={styles.label}>{highlightedData.label}</h1>
            <p className={styles.description}>{description}</p>
            <span className={styles.info} aria-hidden="true">
              Although the {highlightedData.label} covers {highlightedData.percentage.globe}%
              of Earth's surface,...
            </span>
            <span className={styles.info} aria-hidden="true">
              ...it absorbs {highlightedData.percentage.grid}% of the incoming
              energy.
            </span>
            {/* globe positions for this module are actually
set in the previous module (kettleCount) */}
            <div className={styles.globeOverlay}>
              <span>{highlightedData?.percentage.globe}%</span>
            </div>
          </>
        )}
        <div className={styles.treemapContainer}>
          <TreeMapGrid
            data={module.data}
            onHighlightGridCell={setHighlightedLayerId}
          />
        </div>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
