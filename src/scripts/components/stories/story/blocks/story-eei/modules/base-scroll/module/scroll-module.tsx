import { FunctionComponent, PropsWithChildren, useMemo, useRef } from "react";

import { StorySectionProps } from "../../../../../../../../types/story";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { ScrollModuleContext } from "../use-scroll-module";

import cx from "classnames";

import styles from "./scroll-module.module.css";

type Props<TConfig = unknown> = PropsWithChildren<
  StorySectionProps & {
    config: TConfig;
  }
>;

const ScrollSlide = ({
  children,
  className,
  ...rest
}: PropsWithChildren<StorySectionProps>) => {
  const slideRef = useRef(null);

  return (
    <div ref={slideRef} className={cx(styles.slide, className)} {...rest}>
      {children}
    </div>
  );
};

const ScrollModule: FunctionComponent<Props> & {
  Slide: typeof ScrollSlide;
} = ({ children, className, config, ...rest }) => {
  const moduleRef = useRef(null);

  const { scrollY, scrollYProgress } = useStoryScroll({
    target: moduleRef,
    offset: ["start end", "end end"],
  });


  const contextValue = useMemo(
    () => ({ scrollY, scrollYProgress, config }),
    [scrollY, scrollYProgress, config],
  );

  return (
    <ScrollModuleContext.Provider value={contextValue}>
      <div
        ref={moduleRef}
        className={cx(styles.baseScrollModule, className)}
        {...rest}
      >
        {children}
      </div>
    </ScrollModuleContext.Provider>
  );
};

ScrollModule.Slide = ScrollSlide;
export default ScrollModule;
