import { useMemo } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import ScrollModule from "../base-scroll/module/scroll-module";

import styles from "./kettle-amount.module.css";

export default function KettleAmountModule() {
  const scrollYProgress = useMotionValue(0);

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

  return (
    <ScrollModule
      className={styles.kettleAmountWrapper}
      motionCallbacks={motionCallbacks}
    >
      <div className={styles.container}>
        <ScrollModule.Slide className={styles.slide}>
          {Array.from({ length: 7 }).map(() => (
            <div>test</div>
          ))}
        </ScrollModule.Slide>
      </div>
    </ScrollModule>
  );
}
