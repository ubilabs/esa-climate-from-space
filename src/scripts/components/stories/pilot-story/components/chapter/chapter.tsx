import React, {FunctionComponent, PropsWithChildren} from 'react';
import {Parallax, ParallaxProps} from 'react-scroll-parallax';

import cx from 'classnames';

import {useChapter} from '../../hooks/use-chapter';

import styles from './chapter.module.styl';
import {chapterMainElement} from '../../config/main';
interface Props
  extends PropsWithChildren<React.JSX.IntrinsicElements['section']> {
  scrollIndex: number;
  parallaxProps?: ParallaxProps;
}

/**
 * Represents a chapter component with parallax effect.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.scrollIndex - The scroll index.
 * @param {ReactNode} props.children - The child components.
 * @param {string} props.className - The CSS class name.
 * @param {Object} props.parallaxProps - The parallax props.
 * @returns {JSX.Element} The chapter component.
 */
const Chapter: FunctionComponent<Props> = ({
  scrollIndex,
  children,
  className,
  parallaxProps,
  ...rest
}) => {
  const {onSetProgress} = useChapter();
  return (
    <section
      className={cx(styles.sectionContainer, className)}
      // the data-scroll-index attribute is used to determine the scroll index of the chapter
      // If not provided, the navigation will not work correctly
      data-scroll-index={scrollIndex}
      {...rest}>
      <Parallax
        {...parallaxProps}
        id={chapterMainElement}
        data-scroll-index={scrollIndex}
        onProgressChange={() => onSetProgress()}>
        {children}
      </Parallax>
    </section>
  );
};

export default Chapter;
