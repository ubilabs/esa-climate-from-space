import { FunctionComponent, ReactNode } from "react";

import cx from "classnames";

import styles from "./block-format-section.module.css";

interface Props {
  className?: string;
}


export const FormatSection: FunctionComponent<
  Props & { children: ReactNode }
> = ({ children, className }) => (
  <section className={cx(styles.formatSection, className)}>{children}</section>
);
