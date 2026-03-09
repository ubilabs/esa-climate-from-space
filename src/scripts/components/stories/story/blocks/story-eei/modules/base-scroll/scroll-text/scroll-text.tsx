import { motion, useTransform } from "motion/react";
import styles from "./scroll-text.module.css";
import { AnimatedArrowsConfig } from "../../animated-arrows/animated-arrows";
import { useScrollModule } from "../use-scroll-module";

interface Props<T> {
  text: string;
  inputRange: Array<number>;
  outputRange: Array<T>;
}

export default function ScrollText<T extends string | number>({
  text,
  inputRange,
  outputRange,
}: Props<T>) {
  const { scrollYProgress } = useScrollModule<AnimatedArrowsConfig>();

  return (
    <motion.div
      className={styles.scrollText}
      style={{
        y: useTransform(scrollYProgress, inputRange, outputRange),
      }}
    >
      {text}
    </motion.div>
  );
}
