import { useState } from "react";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import cx from "classnames";

import ScrollModule from "../base-scroll/module/scroll-module";
import TreeMapGrid from "./tree-map-grid/tree-map-grid";

import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import styles from "./tree-map.module.css";

export default function TreeMapModule() {
  const { module, getRefCallback } = useModuleContent();
  const [highlightedLayerId, setHighlightedLayerId] = useState<string | null>(
    null,
  );

  const { isDesktop } = useScreenInfo();

  if (!("data" in module)) {
    return;
  }

  const highlightedData = module.data.find(
    ({ layerId }) => layerId === highlightedLayerId,
  );

  let description = "";
  const isIceLayer = highlightedData?.layerId === "eei_ice_mask";

  if (highlightedData) {
    if (isIceLayer) {
      description = `${highlightedData.label} covers ${highlightedData.percentage.globe}% of Earth's surface and it absorbs ${highlightedData.percentage.grid}% of the incoming energy.`;
    } else {
      description = `Although the ${highlightedData.label} covers ${highlightedData.percentage.globe}% of Earth's surface, it absorbs ${highlightedData.percentage.grid}% of the incoming energy.`;
    }
  }

  return (
    <ScrollModule lengthFactor={module.lengthFactor} config={null}>
      <ScrollModule.StickyContainer
        ref={getRefCallback(0, 0)}
        className={styles.slide}
      >
        {highlightedData && description && (
          <>
            <h1 className={styles.label}>{highlightedData.label}</h1>
            <p className={cx(styles.description, isDesktop && "sr-only")}>
              {description}
            </p>
            <span className={styles.info} aria-hidden="true">
              {!isIceLayer && "Although the"} {highlightedData.label} covers{" "}
              {highlightedData.percentage.globe}% of Earth's surface,...
            </span>
            <span className={styles.info} aria-hidden="true">
              ...{isIceLayer && "and "}it absorbs {highlightedData.percentage.grid}% of the incoming
              energy.
            </span>
            {/* globe positions for this module are actually
set in the previous module (kettleCount) */}
            <div className={styles.globeOverlay}>
              <span>{highlightedData?.percentage.globe}%</span>
            </div>
          </>
        )}
        <div
          className={cx(
            styles.treemapContainer,
            !highlightedData?.percentage && styles.hidden,
          )}
        >
          <TreeMapGrid
            data={module.data}
            onHighlightGridCell={setHighlightedLayerId}
          />
        </div>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
