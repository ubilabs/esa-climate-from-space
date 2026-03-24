import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import styles from "./kettle-overlay.module.css";

export interface KettleOverlayProps {
  inputRange: [number, number, number, number];
  text: string;
}

export default function KettleOverlay({
  inputRange,
  text,
}: KettleOverlayProps) {
  const { scrollYProgress } = useScrollModule();

  const y = useTransform(scrollYProgress, inputRange, [
    "100vh",
    "0vh",
    "0vh",
    "-100vh",
  ]);

  return (
    <motion.div className={styles.kettleOverlay} style={{ y }}>
      {text}
    </motion.div>
  );
}
