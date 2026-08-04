import { useState } from "react";
import { InfoIcon } from "../../../../../main/icons/info-icon";
import { AnimatePresence, motion } from "motion/react";

import styles from "./story-legend.module.css";
import { BaseModuleSlide } from "../../../../../../types/story";

interface Props {
  legend: BaseModuleSlide["legend"];
}

const StoryLegend = ({ legend }: Props) => {
  const { values, unit, description } = legend;

  const [isLegendVisible, setIsLegendVisible] = useState(false);
  return (
    <div className={styles.legendContainer}>
      <AnimatePresence>
        {isLegendVisible && (
          <motion.figcaption
            key="legend"
            className={styles.legend}
            style={{ originX: 1 }}
            transformTemplate={({ scaleX }) =>
              `translate(0%, -50%) scaleX(${scaleX ?? 1})`
            }
            initial={{ opacity: 0.8, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.8 }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="sr-only">{description}</span>
            <div className={styles.legendMarkers}>
              {values.map(({ value, color }) => (
                <div key={value} className={styles.legendMarker}>
                  <span
                    className={styles.dot}
                    style={{ backgroundColor: color }}
                    title={String(value)}
                  />
                  {value !== null && (
                    <span className={styles.value}>{value}</span>
                  )}
                </div>
              ))}
            </div>
            <span className={styles.unit}>{unit}</span>
          </motion.figcaption>
        )}
      </AnimatePresence>
      <motion.button
        // This transition will be used when the modal closes
        transition={{ type: "spring" }}
        className={styles.legendToggle}
        onClick={() => setIsLegendVisible((prev) => !prev)}
      >
        {<InfoIcon isCircleBorder small />}
      </motion.button>
    </div>
  );
};

// color-mix(in srgb, plum, #123456)
export default StoryLegend;
