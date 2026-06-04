import { useState } from "react";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import cx from "classnames";

import ScrollModule from "../base-scroll/module/scroll-module";
import TreeMapGrid from "./tree-map-grid/tree-map-grid";

import { useScreenInfo } from "../../../../../../../hooks/use-screen-info";

import styles from "./tree-map.module.css";

const formatText = (
  template: string,
  values: Record<string, string | number>,
) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

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

  const isIceLayer = highlightedData?.layerId === "eei_ice_mask";

  const treeMapContent = module.content;

  const descriptionTemplate = isIceLayer
    ? treeMapContent?.descriptionIce
    : treeMapContent?.description;

  const info1Template = isIceLayer
    ? treeMapContent?.info1Ice
    : treeMapContent?.info1;

  const info2Template = isIceLayer
    ? treeMapContent?.info2Ice
    : treeMapContent?.info2;

  const description =
    highlightedData && descriptionTemplate
      ? formatText(descriptionTemplate, {
          label: highlightedData.label,
          globe: highlightedData.percentage.globe,
          grid: highlightedData.percentage.grid,
        })
      : "";

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
              {info1Template
                ? formatText(info1Template, {
                    label: highlightedData.label,
                    globe: highlightedData.percentage.globe,
                    grid: highlightedData.percentage.grid,
                  })
                : ""}
            </span>
            <span className={styles.info} aria-hidden="true">
              {info2Template
                ? formatText(info2Template, {
                    label: highlightedData.label,
                    globe: highlightedData.percentage.globe,
                    grid: highlightedData.percentage.grid,
                  })
                : ""}
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
