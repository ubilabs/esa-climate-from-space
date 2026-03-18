import { useState } from "react";
import cx from "classnames";

import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import ScrollModule from "../base-scroll/module/scroll-module";
import TreeMapGrid from "./tree-map-grid/tree-map-grid";

import styles from "./tree-map.module.css";

export default function TreeMapModule() {
  const { module } = useModuleContent();
  const [highlightedLayerId, setHighlightedLayerId] = useState<string | null>(
    null,
  );

  if (!("grid" in module)) {
    return;
  }

  const gridData = module.grid.data;
  const highlightedData = gridData.find(
    ({ layerId }) => layerId === highlightedLayerId,
  );

  return (
    <ScrollModule lengthFactor={module.lengthFactor} config={null}>
      <ScrollModule.StickyContainer>
        <div className={styles.slide}>
          <h1 className={styles.label}>{highlightedData?.label}</h1>
          <div className={styles.panelContainer}>
            <div
              className={cx(
                styles.gridPanel,
                !highlightedData && styles.hidden,
              )}
            >
              <h2 className={styles.title}>{module.title.grid}</h2>
              <TreeMapGrid
                data={module.data}
                onHighlightGridCell={setHighlightedLayerId}
              />
            </div>
            {highlightedData && (
              <>
                <div className={styles.globePanel}>
                  <h2 className={styles.title}>{module.title.globe}</h2>
                </div>
                <span className={styles.globeOverlay}>
                  {highlightedData.percentage.globe} %
                </span>
              </>
            )}
          </div>
        </div>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
