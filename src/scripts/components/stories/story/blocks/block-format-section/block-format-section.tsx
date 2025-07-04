import { FunctionComponent, ReactNode } from "react";

import cx from "classnames";

import styles from "./block-format-section.module.css";
import { Parallax, ParallaxProps } from "react-scroll-parallax";

interface Props extends ParallaxProps {
  className?: string;
  children: ReactNode;
}

export const FormatParallexSection: FunctionComponent<Props> = ({
  children,
  className,
  ...parallaxProps
}) => (
  <Parallax
    {...parallaxProps}
    className={cx(styles.formatSection, className)}
    speed={Math.floor(Math.random() * 210) - 10}
  >
    {children}
  </Parallax>
);
