import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMotionValueEvent } from "motion/react";
import cx from "classnames";

import {
  ATMOSPHERE_MASK_RENDER_OPTIONS,
  Layers,
} from "../../../constants/globe";

import { useScrollModule } from "../../base-scroll/use-scroll-module";

import { setSelectedLayerIds } from "../../../../../../../../reducers/layers";
import { setGlobeRenderOptions } from "../../../../../../../../reducers/globe/render-options";
import { setGlobeSpinning } from "../../../../../../../../reducers/globe/spinning";

import { TreeMapModule } from "../../../../../../../../types/story";

import config from "../../../../../../../../config/main";

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

    // Reset to no mask layer and stop spinning when reaching the top or bottom of the scroll
    if (decreasedProgress <= 0 || progress >= 1) {
      setSelectedLayerId(Layers.EEI_NO_MASK);
      return;
    }

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
    }
  });

  useEffect(() => {
    if (selectedLayerId) {
      onHighlightGridCell?.(selectedLayerId);

      let renderOptions = config.globe.renderOptions;
      let spinning = true;

      if (selectedLayerId === Layers.EEI_NO_MASK) {
        spinning = false;
      } else if (selectedLayerId === Layers.EEI_ATMOSPHERE_MASK) {
        renderOptions = { ...renderOptions, ...ATMOSPHERE_MASK_RENDER_OPTIONS };
      }

      dispatch(setGlobeRenderOptions(renderOptions));
      dispatch(setGlobeSpinning(spinning));
      dispatch(
        setSelectedLayerIds({ layerId: selectedLayerId, isPrimary: true }),
      );
    } else {
      dispatch(setGlobeRenderOptions(config.globe.renderOptions));
      dispatch(setGlobeSpinning(false));
    }
  }, [selectedLayerId, dispatch, onHighlightGridCell]);

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
