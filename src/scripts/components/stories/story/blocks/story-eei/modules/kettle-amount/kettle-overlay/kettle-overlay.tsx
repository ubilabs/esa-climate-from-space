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
  const opacity = useTransform(scrollYProgress, inputRange, [0, 1, 1, 0]);

  return (
    <motion.div className={styles.kettleOverlay} style={{ opacity }}>
      {text}
    </motion.div>
  );
}
