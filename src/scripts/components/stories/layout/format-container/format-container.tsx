import { PropsWithChildren, Ref, CSSProperties } from "react";

import cx from "classnames";

import styles from "./format-container.module.css";

interface Props extends PropsWithChildren {
  className?: string;
  // make sure ref is passed as a prop
  // This is necessary, otherwise the SyncStoryUrl component will not detect the section
  ref: Ref<HTMLDivElement> | undefined;
  style?: CSSProperties;
}

// This component is used to wrap each format in the story
export const FormatContainer = ({ children, className, ref, style }: Props) => {
  return (
    <section
      ref={ref}
      className={cx(styles.formatSection, className)}
      style={style}
    >
      {children}
    </section>
  );
};

FormatContainer.displayName = "FormatContainer";
