import { useState } from "react";

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

  return (
    <ScrollModule
      className={styles.treeMapWrapper}
      lengthFactor={module.lengthFactor}
      config={null}
    >
      <ScrollModule.StickyContainer>
        <div className={styles.slide}>
          <h1>
            {
              gridData.find(({ layerId }) => layerId === highlightedLayerId)
                ?.label
            }
          </h1>
          <div className={styles.leftPanel}>
            <h2>{module.grid.title}</h2>
            <TreeMapGrid
              data={module.grid.data}
              onHighlightGridCell={setHighlightedLayerId}
            />
          </div>
        </div>
      </ScrollModule.StickyContainer>
    </ScrollModule>
  );
}
