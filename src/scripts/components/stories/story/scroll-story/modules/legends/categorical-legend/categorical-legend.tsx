import { useState } from "react";
import { InfoIcon } from "../../../../../../main/icons/info-icon";
import { AnimatePresence, motion } from "motion/react";

import { Legend } from "../../../../../../../types/story";

import styles from "./categorical-legend.module.css";

interface Props {
  legend: Legend;
}

const ContinuousLegend = ({ legend }: Props) => {
  const { values = [], unit = "", description = "" } = legend;

  const [isLegendVisible, setIsLegendVisible] = useState(false);
  return (
    <div className={styles.legendContainer}>
      <AnimatePresence>
        {isLegendVisible && (
          <motion.figcaption
            key="legend"
            className={styles.legend}
            style={{ originX: 1 }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
        className={styles.legendToggle}
        onClick={() => setIsLegendVisible((prev) => !prev)}
      >
        {<InfoIcon isCircleBorder small />}
      </motion.button>
    </div>
  );
};

export default ContinuousLegend;
