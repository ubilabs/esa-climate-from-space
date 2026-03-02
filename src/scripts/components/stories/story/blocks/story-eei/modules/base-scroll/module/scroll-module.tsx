import {
  FunctionComponent,
  MutableRefObject,
  PropsWithChildren,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { MotionValue, useMotionValue, useMotionValueEvent } from "motion/react";

import { StorySectionProps } from "../../../../../../../../types/story";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";

import cx from "classnames";

import styles from "./scroll-module.module.css";

const ScrollSlide: FunctionComponent<
  PropsWithChildren<StorySectionProps & { scrollValue: (value: any) => void }>
> = ({ children, className, scrollValue }) => {
  const { getRefCallback } = useModuleContent();

  const slideRef = useRef(null);

  const { scrollY, scrollYProgress } = useStoryScroll({
    target: slideRef,
    offset: ["start end", "end end"],
  });

  // const [y, setY] = useState(0);
  // const [yProgress, setYProgress] = useState(0);
  //
  //
  const doSomething = (value: number) => {
    console.log("🚀 ~ scroll-module.tsx:35 → scrollYProgress:", scrollYProgress);
  };

  useEffect(() => {
    const unsubY = scrollYProgress.on("change", doSomething);

    return () => {
      unsubY();
    };
  }, [scrollYProgress]);

  return (
    <div ref={getRefCallback(0, 0)}>
      <div ref={slideRef} className={cx(styles.slide, className)}>
        {children}
      </div>
    </div>
  );
};

const ScrollModule: FunctionComponent<PropsWithChildren<StorySectionProps>> & {
  Slide: typeof ScrollSlide;
} = ({ children, className }) => {
  const moduleRef = useRef(null);

  const { scrollY, scrollYProgress } = useStoryScroll({
    target: moduleRef,
    offset: ["start end", "end end"],
  });

  // This is just for demonstrative purposes because forces React to re-render (unlike motion's motion values)
  // useMotionValueEvent(scrollY, "change", setY);
  // useMotionValueEvent(scrollYProgress, "change", setYProgress);

  return (
    <div className={cx(styles.baseScrollModule, className)} ref={moduleRef}>
      <div>{children}</div>
    </div>
  );
};

ScrollModule.Slide = ScrollSlide;
export default ScrollModule;
