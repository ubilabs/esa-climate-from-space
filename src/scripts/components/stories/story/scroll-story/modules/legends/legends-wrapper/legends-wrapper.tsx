import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { InfoIcon } from "../../../../../../main/icons/info-icon";

import cx from "classnames";

import styles from "./legends-wrapper.module.css";

interface Props {
  children: ReactNode;
  description: string;
  className?: string;
  containerClassName?: string;
}

const LegendsWrapper = ({
  children,
  description,
  className,
  containerClassName,
}: Props) => {
  const [isLegendVisible, setIsLegendVisible] = useState(false);

  return (
    <div className={cx(styles.legendContainer, containerClassName)}>
      <span className="sr-only">{description}</span>
      <AnimatePresence>
        {isLegendVisible && (
          <motion.div
            key="legend"
            className={cx(styles.legend, className)}
            style={{ originX: 1 }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        className={styles.legendToggle}
        onClick={() => setIsLegendVisible((prev) => !prev)}
      >
        <InfoIcon isCircleBorder small />
      </motion.button>
    </div>
  );
};

export default LegendsWrapper;
