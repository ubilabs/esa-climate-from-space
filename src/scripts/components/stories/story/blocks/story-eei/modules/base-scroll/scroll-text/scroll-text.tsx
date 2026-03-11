import { motion, useTransform } from "motion/react";
import { AnimatedArrowsConfig } from "../../animated-arrows/animated-arrows";
import { useScrollModule } from "../use-scroll-module";

import cx from "classnames";

import styles from "./scroll-text.module.css";


interface Props<T> {
  text: string;
  inputRange: Array<number>;
  outputRange: Array<T>;
  className?: string;
}

export default function ScrollText<T extends string | number>({
  text,
  inputRange,
  outputRange,
  className,
}: Props<T>) {
  const { scrollYProgress } = useScrollModule<AnimatedArrowsConfig>();

  return (
    <motion.div
      className={cx(styles.scrollText, className)}
      style={{
        y: useTransform(scrollYProgress, inputRange, outputRange),
      }}
    >
      {text}
    </motion.div>
  );
}
