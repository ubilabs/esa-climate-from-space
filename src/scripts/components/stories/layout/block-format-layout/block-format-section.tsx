import { FunctionComponent, PropsWithChildren, ReactNode } from "react";

import cx from "classnames";

import styles from "./block-format-section.module.css";
import { Parallax, ParallaxProps } from "react-scroll-parallax";

interface Props extends PropsWithChildren<ParallaxProps> {
  className?: string;
  children: ReactNode;
}

export const FormatParallexLayout: FunctionComponent<Props> = ({
  children,
  className,
  ...parallaxProps
}) => (
  <Parallax {...parallaxProps} className={cx(styles.formatSection, className)}>
    {children}
  </Parallax>
);
