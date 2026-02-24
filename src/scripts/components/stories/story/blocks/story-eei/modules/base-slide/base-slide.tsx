import { FunctionComponent, useRef, useState } from "react";
import { useMotionValueEvent } from "motion/react";

import { StorySectionProps } from "../../../../../../../types/story";
import { useStoryScroll } from "../../../../../../../hooks/use-story-scroll";
import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";

import styles from "./base-slide.module.css";

const BaseSlide: FunctionComponent<StorySectionProps> = () => {
  const { module, getRefCallback } = useModuleContent();
  const { text } = module;

  const slideRef = useRef(null);

  const { scrollY, scrollYProgress } = useStoryScroll({
    target: slideRef,

    offset: ["start end", "end end"],
  });

  const [y, setY] = useState(0);
  const [yProgress, setYProgress] = useState(0);

  // This is just for demonstrative purposes because forces React to re-render (unlike motion's motion values)
  useMotionValueEvent(scrollY, "change", setY);
  useMotionValueEvent(scrollYProgress, "change", setYProgress);

  return (
    <div className={styles.baseSlide} ref={slideRef}>
      <div ref={getRefCallback(0, 0)}>
        <div>{text}</div>
        <div>ScrollY: {y}</div>
        <div>ScrollProgress: {yProgress}</div>
      </div>
    </div>
  );
};

export default BaseSlide;
