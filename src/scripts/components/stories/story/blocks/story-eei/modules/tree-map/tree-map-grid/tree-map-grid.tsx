import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMotionValueEvent } from "motion/react";
import cx from "classnames";

import { useScrollModule } from "../../base-scroll/use-scroll-module";

import { setSelectedLayerIds } from "../../../../../../../../reducers/layers";

import { TreeMapModule } from "../../../../../../../../types/story";

import styles from "./tree-map-grid.module.css";

type TreeMapGridProps = {
  data: TreeMapModule["grid"]["data"];
  onHighlightGridCell?: (layerId: string) => void;
};

export default function TreeMapGrid({
  data,
  onHighlightGridCell,
}: TreeMapGridProps) {
  const dispatch = useDispatch();
  const { scrollYProgress } = useScrollModule();
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (progress: number) => {
    if (!data || data.length === 0) {
      return;
    }

    // Decrease progress by one view height to start the first layer highlight
    // after scrolling one full screen
    const decreasedProgress = progress - 1 / (data.length + 1);

    // Map progress (0-1) to layer index
    // Each layer occupies an equal portion of the scroll range
    const index = Math.min(
      Math.floor(decreasedProgress * (data.length + 1)),
      data.length - 1,
    );

    if (index < 0 || index >= data.length) {
      return;
    }

    const { layerId } = data[index];

    if (layerId !== selectedLayerId) {
      setSelectedLayerId(layerId);
      if (onHighlightGridCell) {
        onHighlightGridCell(layerId);
      }
    }
  });

  useEffect(() => {
    if (selectedLayerId) {
      dispatch(
        setSelectedLayerIds({ layerId: selectedLayerId, isPrimary: true }),
      );
    }
  }, [selectedLayerId, dispatch]);

  const topRowData = data.filter((item) => item.percentage <= 10);
  const bottomRowData = data.filter((item) => item.percentage > 10);

  const topRowTotal = topRowData.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );

  return (
    <div className={styles.gridContainer}>
      {topRowData.length > 0 && (
        <div className={styles.gridTop} style={{ height: `${topRowTotal}%` }}>
          {topRowData.map((item) => (
            <div
              key={item.layerId}
              className={cx(
                styles.gridCell,
                item.layerId === selectedLayerId && styles.highlight,
              )}
              style={{ width: `${(item.percentage / topRowTotal) * 100}%` }}
            >
              <span className={styles.percentage}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      )}
      {bottomRowData.length > 0 && (
        <div className={styles.gridBottom}>
          {bottomRowData.map((item) => (
            <div
              key={item.layerId}
              className={cx(
                styles.gridCellLarge,
                item.layerId === selectedLayerId && styles.highlight,
              )}
              style={{
                flex: item.percentage,
              }}
            >
              <span className={styles.percentage}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
