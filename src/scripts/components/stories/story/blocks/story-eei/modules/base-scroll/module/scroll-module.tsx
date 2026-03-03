import { FunctionComponent, PropsWithChildren, useEffect, useRef } from "react";

import { StorySectionProps } from "../../../../../../../../types/story";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";

import cx from "classnames";

import styles from "./scroll-module.module.css";

type Props = PropsWithChildren<
  StorySectionProps & {
    motionCallbacks?: Record<
      "updateScrollY" | "updateScrollYProgress",
      (value: number) => void
    >;
  }
>;

const ScrollSlide = ({ children, className }: Props) => {
  const { getRefCallback } = useModuleContent();

  const slideRef = useRef(null);

  return (
    <div ref={getRefCallback(0, 0)}>
      <div ref={slideRef} className={cx(styles.slide, className)}>
        {children}
      </div>
    </div>
  );
};

const ScrollModule: FunctionComponent<
  PropsWithChildren<
    StorySectionProps & {
      motionCallbacks?: Record<
        "updateScrollY" | "updateScrollYProgress",
        (value: number) => void
      >;
    }
  >
> & {
  Slide: typeof ScrollSlide;
} = ({ children, className, motionCallbacks }) => {
  const moduleRef = useRef(null);

  const { scrollY, scrollYProgress } = useStoryScroll({
    target: moduleRef,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    const unsubScrollYProgress = scrollYProgress.on("change", (e) =>
      motionCallbacks?.updateScrollYProgress?.(e),
    );

    const unsubScrollY = scrollY.on("change", (e) =>
      motionCallbacks?.updateScrollY?.(e),
    );

    return () => {
      unsubScrollYProgress();
      unsubScrollY();
    };
  }, [motionCallbacks, scrollY, scrollYProgress]);

  return (
    <div ref={moduleRef} className={cx(styles.baseScrollModule, className)}>
      {children}
    </div>
  );
};

ScrollModule.Slide = ScrollSlide;
export default ScrollModule;
