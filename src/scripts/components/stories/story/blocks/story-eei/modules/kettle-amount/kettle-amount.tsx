import {  useMemo } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import ScrollModule from "../base-scroll/module/scroll-module";

import styles from "./kettle-amount.module.css";
import KettleRow from "./kettle-row/kettle-row";

export default function KettleAmountModule() {
  const scrollYProgress = useMotionValue(0);
  const moduleTotalLength = 10;

  // get the motion values from the module wrapper
  const motionCallbacks = useMemo(
    () => ({
      updateScrollYProgress: (value: number) => scrollYProgress.set(value),
      updateScrollY: () => null,
    }),
    [scrollYProgress],
  );

  useMotionValueEvent(scrollYProgress, "change", (e: number) =>
    console.log("using progress value", e),
  );

  const scale = useTransform(scrollYProgress, [0.1, 0.2], [0.1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], ["20%", "0%"]);

  const kettleRowCounter = 8;

  return (
    <ScrollModule
      style={{ height: `calc(var(--story-height) * ${moduleTotalLength})` }}
      className={styles.kettleAmountWrapper}
      motionCallbacks={motionCallbacks}
    >
      <ScrollModule.Slide className={styles.container}>
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0.1, 0.2], ["0vh", "-100vh"]),
          }}
          className={styles.bulbContainer}
        >
          <span>placeholder</span>
          <span>Each square metre of Earth’s surface retains 1.4 Watts.</span>
        </motion.div>
        <motion.div className={styles.box} style={{ scale, y }}>
          {Array.from({ length: kettleRowCounter }).map((_, index) => (
            <KettleRow index={index} progress={scrollYProgress} />
          ))}
          <motion.span
            className={styles.squareMeter}
            style={{
              scale: useTransform(scrollYProgress, [0.2, 0.3], ["7", "1"]),
            }}
          >
            1m2
          </motion.span>
        </motion.div>
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
