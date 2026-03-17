import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount";

import styles from "./year-slider.module.css";

export default function YearSlider() {
  const { config, scrollYProgress } =
    useScrollModule<KettleAmountAnimationConfig>();
  const startYear = 2000;
  const numberOfYears = 26;

  return (
    <motion.div
      className={styles.yearSlider}
      initial={{ opacity: 0 }}
      style={{
        opacity: useTransform(
          scrollYProgress,
          config.yearSlider.fadeIn.input,
          config.yearSlider.fadeIn.output,
        ),
      }}
    >
      <motion.div
        className={styles.container}
        style={{
          x: useTransform(
            scrollYProgress,
            config.yearSlider.slide.input,
            config.yearSlider.slide.output,
          ),
        }}
      >
        {Array.from({ length: numberOfYears }).map((_, index) => (
          <span key={index}>{startYear + index}</span>
        ))}
      </motion.div>
    </motion.div>
  );
}
