import { motion, useTransform } from "motion/react";
import { EEIArrow } from "../../../../../../../main/icons/eei-arrow";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { AnimatedArrowsConfig } from "../animated-arrows";

import styles from "./arrows.module.css";

export default function Arrows() {
  const { scrollYProgress, config } = useScrollModule<AnimatedArrowsConfig>();

  // Down arrow reveals diagonally from top-left toward bottom-right (keeps tip intact)
  const downArrowProgress = useTransform(
    scrollYProgress,
    config.downArrow.input ,
    config.downArrow.output ,
  );

  const downArrowClip = useTransform(
    downArrowProgress,
    (value: number) => `inset(0% ${value}% ${value}% 0%)`,
  );

  // Up arrow reveals from bottom-left toward top-right (keeps tip intact)
  const upArrowProgress = useTransform(
    scrollYProgress,
    config.upArrow.input ,
    config.upArrow.output ,
  );

  const upArrowClip = useTransform(
    upArrowProgress,
    (value: number) => `inset(${value}% ${value}% 0% 0%)`,
  );

  const opacity = useTransform(
    scrollYProgress,
    config.opacity.input ,
    config.opacity.output ,
  );

  return (
    <motion.div className={styles.arrows}>
      <motion.span
        className={styles.arrow}
        style={{
          clipPath: downArrowClip,
          opacity,
        }}
      >
        <EEIArrow variant="down" />
      </motion.span>
      <motion.span
        className={styles.arrow}
        style={{
          clipPath: upArrowClip,
          opacity,
        }}
      >
        <EEIArrow variant="up" />
      </motion.span>
    </motion.div>
  );
}
