import React, {FunctionComponent, PropsWithChildren, ReactNode} from 'react';

import styles from './chapter.module.styl';

import cx from 'classnames';
import {Parallax, ParallaxProps} from 'react-scroll-parallax';

interface Props
  extends PropsWithChildren<React.JSX.IntrinsicElements['section']> {
  scrollIndex: number;
  children: ReactNode;
  parallaxProps?: PropsWithChildren<ParallaxProps>;
}

const Chapter: FunctionComponent<Props> = ({
  scrollIndex,
  children,
  className,
  parallaxProps,
  ...rest
}) => (
  <section
    className={cx(styles.sectionContainer, className)}
    data-scroll-index={scrollIndex}
    {...rest}>
    <Parallax {...parallaxProps}>{children}</Parallax>
  </section>
);

export default Chapter;
