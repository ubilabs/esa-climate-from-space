import { motion, useTransform } from "motion/react";

import { useScrollModule } from "../../../modules/base-scroll/use-scroll-module";

import styles from "./dimmer.module.css";

export interface DimmerAnimationConfig {
  dimmer: {
    input: number[];
    output: number[];
  };
  [key: string]: unknown;
}

export default function Dimmer() {
  const { scrollYProgress, config } = useScrollModule<DimmerAnimationConfig>();

  const opacity = useTransform(
    scrollYProgress,
    config.dimmer.input,
    config.dimmer.output,
  );

  return (
    <motion.div
      className={styles.dimmer}
      style={{ "--x-fires-dimmer-opacity": opacity } as React.CSSProperties}
    />
  );
}
