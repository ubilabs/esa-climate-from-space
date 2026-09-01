import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { InfoIcon } from "../../../../../main/icons/info-icon";

import cx from "classnames";

import styles from "./info-popover.module.css";

interface Props {
  children: ReactNode;
  description: string;
  className?: string;
  contentClassName?: string;
}

const InfoPopover = ({
  children,
  description,
  className,
  contentClassName,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={cx(styles.container, className)}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="content"
            className={cx(styles.content, contentClassName)}
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
        className={styles.toggle}
        aria-label={description}
        aria-expanded={isVisible}
        onClick={() => setIsVisible((visible) => !visible)}
      >
        <InfoIcon isCircleBorder small />
      </motion.button>
    </div>
  );
};

export default InfoPopover;
