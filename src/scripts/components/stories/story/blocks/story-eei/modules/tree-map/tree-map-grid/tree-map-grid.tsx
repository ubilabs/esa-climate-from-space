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
  const { scrollYProgress: storyScrollYProgress } = useScrollModule();
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useMotionValueEvent(storyScrollYProgress, "change", (progress: number) => {
    if (!data || data.length === 0) {
      return;
    }
    // Map progress (0-1) to layer index
    // Each layer occupies an equal portion of the scroll range
    const index = Math.min(
      Math.floor(progress * (data.length + 1)),
      data.length - 1,
    );

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

  const topRowData = data.slice(0, 3);
  const bottomData = data[3];

  const topRowTotal = topRowData.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridTop} style={{ height: `${topRowTotal}%` }}>
        {topRowData.map((data, index) => (
          <div
            key={index}
            className={cx(
              styles.gridCell,
              data.layerId === selectedLayerId && styles.highlight,
            )}
            style={{ width: `${(data.percentage / topRowTotal) * 100}%` }}
          >
            <span className={styles.percentage}>{data.percentage}%</span>
          </div>
        ))}
      </div>
      <div
        className={styles.gridBottom}
        style={{ height: `${bottomData.percentage}%` }}
      >
        <div
          className={cx(
            styles.gridCellLarge,
            bottomData.layerId === selectedLayerId && styles.highlight,
          )}
        >
          <span className={styles.percentage}>{bottomData.percentage}%</span>
        </div>
      </div>
    </div>
  );
}
