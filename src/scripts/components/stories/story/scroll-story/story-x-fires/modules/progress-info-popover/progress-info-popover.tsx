import { ReactNode } from "react";
import { motion, useTransform } from "motion/react";

import { MotionStyle } from "motion";

import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";
import InfoPopover from "../../../modules/info-popover/info-popover";

import styles from "./progress-info-popover.module.css"

interface Props {
  children: ReactNode;
  description: string;
  className?: string;
  contentClassName?: string;
  startProgress?: number;
  fadeInEndProgress?: number;
infoContent: string
}

const ProgressInfoPopover = ({
  description,
  className,
  startProgress = 0.9,
  fadeInEndProgress = 0.92,
  infoContent

}: Props) => {
  const { scrollYProgress } = useScrollModule();
  const opacity = useTransform(
    scrollYProgress,
    [startProgress, fadeInEndProgress, 1],
    [0, 1, 1],
  );
  const pointerEvents = useTransform(
    scrollYProgress,
    [0, startProgress, fadeInEndProgress, 1],
    ["none", "none", "auto", "auto"],
  );


  return (
    <motion.div
      className={styles.infoContent}
      style={{ opacity, pointerEvents } as MotionStyle}>
      <InfoPopover description={description} className={className}>
        {infoContent}
      </InfoPopover>
    </motion.div>
  );
};

export default ProgressInfoPopover;
