import { PropsWithChildren, Ref, CSSProperties, HTMLAttributes } from "react";

import cx from "classnames";

import styles from "./module-container.module.css";

interface Props extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  className?: string;
  // make sure ref is passed as a prop
  // This is necessary, otherwise the SyncStoryUrl component will not detect the section
  ref: Ref<HTMLDivElement> | undefined;
  style?: CSSProperties;
}

/**
 * A wrapper component for rendering a module section. It accepts children elements,
 * This is optional but provides some  styling and anchor ref
 */
export const ModuleContainer = ({
  children,
  className,
  ref,
  style,
  ...elementProps
}: Props) => {
  return (
    <div
      ref={ref}
      className={cx(styles.module, className)}
      style={style}
      {...elementProps}
    >
      {children}
    </div>
  );
};

ModuleContainer.displayName = "ModuleContainer";
