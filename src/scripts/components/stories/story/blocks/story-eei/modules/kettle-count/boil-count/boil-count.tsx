import { useEffect, useState } from "react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { motion, useTransform } from "motion/react";
import { KettleCountConfig } from "../kettle-count";

import styles from "./boil-count.module.css";

export default function BoilCount() {
  const [value, setValue] = useState(1000);

  const { scrollYProgress, config } = useScrollModule<KettleCountConfig>();

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prevValue) => prevValue + 1000);
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
      <span className={styles.count}>{value}</span>
      <span className={styles.text}>kettles of water</span>
    </motion.div>
  );
}
