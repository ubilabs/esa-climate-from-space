import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount-types";
import styles from "./square-meter-label.module.css";

export default function SquareMeterLabel() {
  const { scrollYProgress, config } =
    useScrollModule<KettleAmountAnimationConfig>();

  return (
    <motion.span
      className={styles.squareMeter}
      style={{
        scale: useTransform(
          scrollYProgress,
          config.squareMeterScale.input,
          config.squareMeterScale.output,
        ),
      }}
    >
      1m<sup>2</sup>
    </motion.span>
  );
}
