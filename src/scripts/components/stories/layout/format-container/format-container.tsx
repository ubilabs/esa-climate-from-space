import { PropsWithChildren, Ref } from "react";

import cx from "classnames";

import styles from "./format-container.module.css";

interface Props extends PropsWithChildren {
  className?: string;
  // make sure ref is passed as a prop
  // This is necessary, otherwise the SyncStoryUrl component will not detect the section
  ref: Ref<HTMLDivElement> | undefined;
}

// This component is used to wrap each format in the story
export const FormatContainer = ({ children, className, ref }: Props) => {
  return (
    <section ref={ref} className={cx(styles.formatSection, className)}>
      {children}
    </section>
  );
};

FormatContainer.displayName = "FormatContainer";
