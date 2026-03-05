import { motion, useTransform } from "motion/react";
import { EEIArrow } from "../../../../../../../main/icons/eei-arrow";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { AnimatedArrowsConfig } from "../animated-arrows";

import styles from "./arrows.module.css";

export default function Arrows() {
  const { scrollYProgress } = useScrollModule<AnimatedArrowsConfig>();

  // Down arrow scales from top-left corner (shoots down diagonally)
  const downArrowScale = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  // Up arrow scales from bottom-left corner (shoots up diagonally)
  const upArrowScale = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

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
          scale: downArrowScale,
          transformOrigin: "top left",
          display: "inline-block",
        }}
      >
        <EEIArrow variant="down" />
      </motion.span>
      <motion.span
        style={{
          scale: upArrowScale,
          transformOrigin: "bottom left",
          display: "inline-block",
        }}
      >
        <EEIArrow variant="up" />
      </motion.span>
    </motion.div>
  );
}
