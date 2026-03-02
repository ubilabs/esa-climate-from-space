import { useRef } from "react";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import ScrollModule from "../base-scroll/module/scroll-module";

import styles from "./kettle-amount.module.css";
import { MotionValue } from "motion";

export default function KettleAmountModule() {
  // const { module } = useModuleContent();
  // // const { text } = module;

  const valueRef = useRef<MotionValue<number>>(null);
  // console.log("🚀 ~ kettle-amount.tsx:12 → valueRef:", valueRef);

  return (
    <ScrollModule className={styles.kettleAmountWrapper}>
      <ScrollModule.Slide
        className={styles.test}
        scrollValue={(value: MotionValue<number>) => (valueRef.current = value)}
      >
        slide 1
      </ScrollModule.Slide>
    </ScrollModule>
  );
}
