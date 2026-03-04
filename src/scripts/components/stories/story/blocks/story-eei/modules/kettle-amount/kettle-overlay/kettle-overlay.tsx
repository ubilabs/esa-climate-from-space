import { motion, MotionValue, useTransform } from "motion/react";
import styles from "./kettle-overlay.module.css";

interface Props {
  inputRange: [number, number, number, number];
  text: string;
  progress: MotionValue;
}

export default function KettleOverlay({ inputRange, text, progress }: Props) {
  const opacity = useTransform(progress, inputRange, [0, 1, 1, 0]);

  return (
    <motion.div className={styles.kettleOverlay} style={{ opacity }}>
      {text}
    </motion.div>
  );
}
