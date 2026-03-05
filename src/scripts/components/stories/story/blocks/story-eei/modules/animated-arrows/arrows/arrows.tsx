import { motion, useTransform } from "motion/react";
import { EEIArrow } from "../../../../../../../main/icons/eei-arrow";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { AnimatedArrowsConfig } from "../animated-arrows";

import styles from "./arrows.module.css";

export default function Arrows() {
  const { scrollYProgress } = useScrollModule<AnimatedArrowsConfig>();

  // Down arrow reveals diagonally from top-left toward bottom-right (keeps tip intact)
  const downArrowProgress = useTransform(
    scrollYProgress,
    [0.2, 0.4],
    [100, 0],
  );

  const downArrowClip = useTransform(
    downArrowProgress,
    (value) => `inset(0% ${value}% ${value}% 0%)`,
  );

  // Up arrow reveals from bottom-left toward top-right (keeps tip intact)
  const upArrowProgress = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);
  const upArrowClip = useTransform(
    upArrowProgress,
    (value) => `inset(${value}% ${value}% 0% 0%)`,
  );

  const opacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);
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
