import { ReactNode } from "react";
import { motion, useTransform } from "motion/react";

import { MotionStyle } from "motion";

import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";
import InfoPopover from "../../../modules/info-popover/info-popover";
import { PortugalDataLayersAnimationConfig } from "../portugal-data-layers/portugal-data-layers";

import styles from "./progress-info-popover.module.css";

interface Props {
  children: ReactNode;
  description: string;
  className?: string;
  contentClassName?: string;
  infoContent: string;
}

const ProgressInfoPopover = ({
  description,
  className,
  contentClassName,
  infoContent,
}: Props) => {
  const { scrollYProgress, config } =
    useScrollModule<PortugalDataLayersAnimationConfig>();
  const opacity = useTransform(
    scrollYProgress,
    [config.progressInfoPopover.startProgress, config.progressInfoPopover.endProgress, 1],
    [0, 1, 1],
  );

  return (
    <motion.div
      style={
        {
          "--info-container-opacity": opacity,
        } as MotionStyle
      }
      className={styles.container}
    >
      <InfoPopover
        description={description}
        className={className}
        contentClassName={contentClassName ?? styles.content}
      >
        {infoContent}
      </InfoPopover>
    </motion.div>
  );
};

export default ProgressInfoPopover;
