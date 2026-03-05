import { motion, useTransform, useMotionTemplate } from "motion/react";
import { EEIArrow } from "../../../../../../../main/icons/eei-arrow";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { AnimatedArrowsConfig } from "../animated-arrows";

import styles from "./arrows.module.css";

export default function Arrows() {
  const { scrollYProgress } = useScrollModule<AnimatedArrowsConfig>();

  // Down arrow reveals diagonally from top-left toward bottom-right (keeps tip intact)
  const downArrowProgress = useTransform(scrollYProgress, [0.2, 0.4], [100, 0]);
  const downArrowClip = useMotionTemplate`inset(0% ${downArrowProgress}% ${downArrowProgress}% 0%)`;

  // Up arrow reveals from bottom-left toward top-right (keeps tip intact)
  const upArrowProgress = useTransform(scrollYProgress, [0.4, 0.6], [100, 0]);
  const upArrowClip = useMotionTemplate`inset(${upArrowProgress}% ${upArrowProgress}% 0% 0%)`;

  return (
    <motion.div
      className={styles.arrows}
      style={{
        opacity: useTransform(
          scrollYProgress,
          [0, 0.19, 0.2, 0.8],
          [0, 0, 1, 0],
        ),
      }}
    >
      <motion.span
        style={{
          clipPath: downArrowClip,
          display: "inline-block",
        }}
      >
        <EEIArrow variant="down" />
      </motion.span>
      <motion.span
        style={{
          clipPath: upArrowClip,
          display: "inline-block",
        }}
      >
        <EEIArrow variant="up" />
      </motion.span>
    </motion.div>
  );
}
