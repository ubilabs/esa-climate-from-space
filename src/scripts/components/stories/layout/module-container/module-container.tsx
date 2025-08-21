import { PropsWithChildren, Ref, CSSProperties } from "react";

import cx from "classnames";

import styles from "./module-container.module.css";

interface Props extends PropsWithChildren {
  className?: string;
  // make sure ref is passed as a prop
  // This is necessary, otherwise the SyncStoryUrl component will not detect the section
  ref: Ref<HTMLDivElement> | undefined;
  style?: CSSProperties;
}

/**
 * A wrapper component for rendering a module section. It accepts children elements,
 * This is optional but provides some common section styling and correct anchor ref
 */
export const ModuleWrapper = ({ children, className, ref, style }: Props) => {
  return (
    <section ref={ref} className={cx(styles.module, className)} style={style}>
      {children}
    </section>
  );
};

ModuleWrapper.displayName = "ModuleWrapper";
