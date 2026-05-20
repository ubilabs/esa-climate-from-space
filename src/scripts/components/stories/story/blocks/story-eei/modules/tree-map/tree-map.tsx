import { useState } from "react";
import cx from "classnames";

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

  return (
    <ScrollModule lengthFactor={module.lengthFactor} config={null}>
      <ScrollModule.StickyContainer ref={getRefCallback(0, 0)}>
        <div className={styles.slide}>
          <h1 className={styles.label}>{highlightedData?.label}</h1>
          <div className={styles.panelContainer}>
            <h2 className={styles.title}>{module.title.grid}</h2>
            <div
              className={cx(
                styles.gridPanel,
                !highlightedData && styles.hidden,
              )}
            >
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
