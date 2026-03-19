import {
  CSSProperties,
  FunctionComponent,
  PropsWithChildren,
  useMemo,
  useRef,
} from "react";

import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";

import { StorySectionProps } from "../../../../../../../../types/story";
import { ScrollModuleContext } from "../use-scroll-module";

import cx from "classnames";

import styles from "./scroll-module.module.css";

import { DATA_NO_SNAP_ATTR } from "../../../../../../../../hooks/use-lenis-for-story";

type Props<TConfig = unknown> = PropsWithChildren<
  Omit<
    StorySectionProps & {
      config: TConfig;
      lengthFactor: number;
    },
    "ref"
  >
>;

const StickyContainer = ({
  children,
  className,
  isGrid = false,
  ...rest
}: PropsWithChildren<StorySectionProps & { isGrid?: boolean }>) => {
  return (
    <div
      // remove snap from story-eei
      {...{ [DATA_NO_SNAP_ATTR]: true }}
      className={cx(styles.sticky, isGrid && styles.grid, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

const ScrollModule: FunctionComponent<Props> & {
  StickyContainer: typeof StickyContainer;
} = ({ children, className, config, lengthFactor, ...rest }) => {
  if (lengthFactor === null || typeof lengthFactor !== "number") {
    console.warn(
      "Warning: lengthFactor is missing or not a number in ScrollModule. This can cause out-of-sync globe movements",
      lengthFactor,
    );
  }
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
