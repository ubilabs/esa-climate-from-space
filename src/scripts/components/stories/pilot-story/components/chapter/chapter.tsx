import React, {FunctionComponent, PropsWithChildren, useEffect} from 'react';
import {Parallax, ParallaxProps} from 'react-scroll-parallax';

import cx from 'classnames';

import {useChapter} from '../../hooks/use-chapter';
import {useGlobeLayers} from '../../hooks/use-globe';

import {
  BLUE_BASE_MAP,
  GREENHOUSE_XCH4,
  GREY_BASE_MAP,
  SUPER_EMITTERS,
  chapterMainElement
} from '../../config/main';

import styles from './chapter.module.styl';

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
  const {setLayers} = useGlobeLayers();
  const {onSetProgress, selectedChapterIndex} = useChapter();

  useEffect(() => {
    switch (selectedChapterIndex) {
      case 0:
        setLayers([GREY_BASE_MAP, GREENHOUSE_XCH4]);
        break;
      case 1:
        setLayers([GREY_BASE_MAP, GREENHOUSE_XCH4]);
        break;
      case 2:
        setLayers([GREY_BASE_MAP]);
        break;
      case 3:
        setLayers([BLUE_BASE_MAP]);
        break;
      case 4:
        setLayers([BLUE_BASE_MAP]);
        break;
      case 5:
        setLayers([GREY_BASE_MAP, SUPER_EMITTERS]);
        break;
      case 6:
        setLayers([BLUE_BASE_MAP]);
        break;
      case 7:
        setLayers([BLUE_BASE_MAP]);
        break;
      default:
        break;
    }
  }, [selectedChapterIndex, setLayers]);

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
