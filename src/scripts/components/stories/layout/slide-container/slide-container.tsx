import { PropsWithChildren, Ref, CSSProperties, HTMLAttributes } from "react";

import cx from "classnames";

import styles from "./slide-container.module.css";

interface Props extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  className?: string;
  // make sure ref is passed as a prop
  // This is necessary, otherwise the SyncStoryUrl component will not detect the section
  ref?: Ref<HTMLDivElement> | undefined;
  style?: CSSProperties;
}

/**
 * A wrapper component for rendering a slide. It accepts children elements
 * This is optional but provides some styling and anchor ref
 */
export const SlideContainer = ({
  children,
  className,
  ref,
  style,
  ...elementProps
}: Props) => {
  return (
    <div
      ref={ref}
      className={cx(styles.slideContainer, className)}
      style={style}
      {...elementProps}
    >
      {children}
    </div>
  );
};

SlideContainer.displayName = "ModuleContainer";
