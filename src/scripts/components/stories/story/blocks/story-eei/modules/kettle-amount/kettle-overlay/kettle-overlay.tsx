import { motion, MotionValue, useTransform } from "motion/react";
import styles from "./kettle-overlay.module.css";

interface Props {
  inpuRange: [number, number, number, number];
  text: string;
  progress: MotionValue;
}

export default function KettleOverlay({ inpuRange, text, progress }: Props) {
  const opacity = useTransform(progress, inpuRange, [0, 1, 1, 0]);
  console.log("🚀 ~ kettle-overlay.tsx:11 → opacity:", opacity);

  return (
    <motion.div className={styles.kettleOverlay} style={{ opacity }}>
      {text}
    </motion.div>
  );
}
