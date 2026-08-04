import {
  CSSProperties,
  FunctionComponent,
  PropsWithChildren,
  RefObject,
  useMemo,
  useRef,
} from "react";

import { useStoryScroll } from "../../../../../../../hooks/use-story-scroll";

import { StorySectionProps } from "../../../../../../../types/story";
import { ScrollModuleContext } from "../use-scroll-module";

import cx from "classnames";

import styles from "./scroll-module.module.css";

type Props<TConfig = unknown> = StorySectionProps & {
  config: TConfig;
  lengthFactor: number;
};

const StickyContainer = ({
  children,
  className,
  isGrid = false,
  ...rest
}: PropsWithChildren<StorySectionProps & { isGrid?: boolean }>) => {
  return (
    <div
      className={cx(styles.sticky, isGrid && styles.grid, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * We use this as a wrapper to for scroll module. It provides us with the current absolute and relative scroll position within the story
 * This component may receive a refTarget from a parent component e.g. to add it to mooduleRefsMap which is used to track progress of story in the chapter-progress-indicator
 * If no ref is passed, we create a local ref in order to still have a reference to the element
 */
const ScrollModule: FunctionComponent<Props> & {
  StickyContainer: typeof StickyContainer;
} = ({ children, className, config, lengthFactor, refTarget, ...rest }) => {
  if (lengthFactor === null || typeof lengthFactor !== "number") {
    console.warn(
      "Warning: lengthFactor is missing or not a number in ScrollModule. This can cause out-of-sync globe movements",
      lengthFactor,
    );
  }

  const localRef = useRef(null);
  // local ref only used if no ref prop is passed
  const moduleRef = (refTarget ?? localRef) as RefObject<HTMLDivElement>;

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
        style={
          {
            "--scroll-length-factor": lengthFactor,
          } as CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </ScrollModuleContext.Provider>
  );
};

ScrollModule.StickyContainer = StickyContainer;
export default ScrollModule;
