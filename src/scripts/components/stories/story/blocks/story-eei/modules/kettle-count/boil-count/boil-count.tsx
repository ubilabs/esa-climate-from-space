import { useEffect, useState } from "react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { motion, useTransform } from "motion/react";
import { KettleCountConfig } from "../kettle-count";

import styles from "./boil-count.module.css";

function abbreviateNumber(num: number): string {
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  return (num / 1_000_000_000_000).toFixed(1) + "T";
}

export default function BoilCount() {
  const KETTLES_PER_SECOND = 1137667304;
  const [value, setValue] = useState(0);

  const { scrollYProgress, config } = useScrollModule<KettleCountConfig>();

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => prevValue + KETTLES_PER_SECOND);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={styles.countWrapper}
      style={{
        y: useTransform(
          scrollYProgress,
          config.scrollText2.input,
          config.scrollText2.output,
        ),
      }}
    >
      <span className={styles.count}>{abbreviateNumber(value)}</span>
      <span className={styles.text}>kettles of water</span>
    </motion.div>
  );
}
