import { motion, useTransform } from "motion/react";
import { AnimatedArrowsConfig } from "../../animated-arrows/animated-arrows";
import { useScrollModule } from "../use-scroll-module";

import cx from "classnames";

import styles from "./scroll-text.module.css";

type InlinePlacement = "right" | "center" | "left";

interface Props<T extends string | number> {
  text: string;
  inputRange?: Array<number>;
  outputRange?: Array<T>;
  className?: string;
  isHeadline?: boolean;
  inlinePlacement?: InlinePlacement;
}

export default function ScrollText<T extends string | number>({
  text,
  inputRange = [1],
  outputRange = [1] as T[],
  className,
  isHeadline = false,
  inlinePlacement = "center",
}: Props<T>) {
  const { scrollYProgress } = useScrollModule<AnimatedArrowsConfig>();
  const ContentTag = isHeadline ? "h2" : "span";

  return (
    <motion.div
      className={cx(styles.scrollText, className, styles[inlinePlacement])}
      style={{
        y: useTransform(scrollYProgress, inputRange, outputRange),
      }}
    >
      <ContentTag
        className={cx(styles.content, isHeadline && styles.headlineContent)}
      >
        {text}
      </ContentTag>
    </motion.div>
  );
}
