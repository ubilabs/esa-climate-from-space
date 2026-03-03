import { MotionValue } from "motion";
import styles from "./year-slider.module.css";
import { motion, useTransform } from "motion/react";

interface Props {
  progress: MotionValue;
}

export default function YearSlider({ progress }: Props) {
  const startYear = 2017;
  const numberOfYears = 9;

  return (
    <motion.div
      className={styles.yearSlider}
      initial={{ opacity: 0 }}
      style={{
        opacity: useTransform(progress, [0.3, 0.33], ["0", "1"]),
      }}
    >
      <motion.div
        className={styles.container}
        style={{
          x: useTransform(progress, [0, 0.54, 0.64], ["-46%", "-46%", "0%"]),
        }}
      >
        {Array.from({ length: numberOfYears }).map((_, index) => (
          <span>{startYear + index}</span>
        ))}
      </motion.div>
    </motion.div>
  );
}
