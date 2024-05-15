import React, {FunctionComponent, PropsWithChildren, ReactNode} from 'react';

import styles from './chapter.module.styl';

import cx from 'classnames';

interface Props
  extends PropsWithChildren<React.JSX.IntrinsicElements['section']> {
  scrollIndex: number;
  children: ReactNode;
}

const Chapter: FunctionComponent<Props> = ({
  scrollIndex,
  children,
  className,
  ...rest
}) => (
  <section
    className={cx(styles.sectionContainer, className)}
    data-scroll-index={scrollIndex}
    {...rest}>
    {children}
  </section>
);

export default Chapter;
