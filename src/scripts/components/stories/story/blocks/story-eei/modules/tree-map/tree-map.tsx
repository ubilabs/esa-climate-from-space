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

  if (!("grid" in module)) {
    return;
  }

  const gridData = module.grid.data;

  return (
    <ScrollModule
      ref={getRefCallback(0, 0)}
      className={styles.treeMapWrapper}
      style={{
        height: `calc(var(--story-height) * ${module.grid.data.length})`,
      }}
      config={null}
    >
      <ScrollModule.Slide className={styles.container} config={{}}>
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
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
