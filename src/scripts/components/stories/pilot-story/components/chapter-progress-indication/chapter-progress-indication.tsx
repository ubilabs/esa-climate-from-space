import React, {FunctionComponent, useRef} from 'react';

import {useChapter} from '../../hooks/use-chapter';

import {
  chapters,
  dataIsTitleInView,
  progressIndicationElement
} from '../../config/main';
import {ChapterPosition} from '../../types/globe';

import {scrollToChapterIndex} from '../nav-chapter-overview/nav-chapter-overview';

import cx from 'classnames';

import styles from './chapter-progress-indication.module.styl';

interface Props {
  chapters: Record<'title' | 'subtitle', string>[];
  gap?: number;
  className?: string;
  isDesktop?: boolean;
}

/**
 * Displays the progress indication for the chapters in a story.
 * In conjunction with the useChapterObserver hook, it displays the current position of the story.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.chapters - The array of chapters.
 * @param {string} [props.className] - The additional CSS class name.
 * @param {number} [props.gap=24] - The gap between the chapter symbols in pixels.
 * @returns {JSX.Element} The chapter progress indication component.
 */
// eslint-disable-next-line complexity
const ChapterProgressIndication: FunctionComponent<Props> = ({
  chapters: navChapters,
  className,
  gap = 24,
  isDesktop
}) => {
  const {selectedChapterIndex, chapterPosition, progress, isSubChapter} =
    useChapter();

  gap =
    isDesktop && isSubChapter
      ? gap * chapters.length + chapters.length * 12
      : gap;

  const indicationRef = useRef<HTMLDivElement>(null);

  const length = isSubChapter ? 1 : navChapters.length;
  // gap = isSubChapter ? gap * chapters.length + chapters.length * 12 : gap;
  // The gap between the chapter symbols
  // Can be set to any value in px (defaults to 24px)
  const style = {
    '--gap': `${gap}px`,
    // The radius of the circle / rect indication
    // Todo: Ask designer for equal size of circle and rect
    '--circle-radius': `${isSubChapter ? 8 : 12}px`
  } as React.CSSProperties;

  // Todo: Refactor
  if (indicationRef.current) {
    if (isSubChapter) {
      indicationRef.current.setAttribute(dataIsTitleInView, 'false');

      const progressIndicatorHeight = indicationRef.current.clientHeight;

      // Get the circle radius from the CSS custom property
      // This is used to calculate the offset of the indicator
      // We want the indicator to start below the circle indication for the selected chapter intro
      const circleRadius = Number(
        window
          .getComputedStyle(indicationRef.current)
          .getPropertyValue('--circle-radius')
          .replace('px', '')
      );

      if (progressIndicatorHeight && length) {
        const indicatorYOffsetInPx =
          (progressIndicatorHeight / length) * selectedChapterIndex +
          (progressIndicatorHeight / length) * progress +
          (selectedChapterIndex * gap) / circleRadius;

        const indicatorYOffsetInPercent = `${
          (indicatorYOffsetInPx / progressIndicatorHeight) * 100
        }%`;

        indicationRef.current.style.setProperty(
          '--indicator-y-offset',
          indicatorYOffsetInPercent
        );
      }
    }
    if (chapterPosition === ChapterPosition.CONTENT) {
      indicationRef.current.setAttribute(dataIsTitleInView, 'false');

      const progressIndicatorHeight = indicationRef.current.clientHeight;

      // Get the circle radius from the CSS custom property
      // This is used to calculate the offset of the indicator
      // We want the indicator to start below the circle indication for the selected chapter intro
      const circleRadius = Number(
        window
          .getComputedStyle(indicationRef.current)
          .getPropertyValue('--circle-radius')
          .replace('px', '')
      );

      if (progressIndicatorHeight && length) {
        const indicatorYOffsetInPx =
          (progressIndicatorHeight / length) * selectedChapterIndex +
          (progressIndicatorHeight / length) * progress +
          (selectedChapterIndex * gap) / circleRadius;

        const indicatorYOffsetInPercent = `${
          (indicatorYOffsetInPx / progressIndicatorHeight) * 100
        }%`;

        indicationRef.current.style.setProperty(
          '--indicator-y-offset',
          indicatorYOffsetInPercent
        );
      }
    } else if (chapterPosition === ChapterPosition.INTRO) {
      indicationRef.current.setAttribute(dataIsTitleInView, 'true');
    }
  }

  return (
    <div
      ref={indicationRef}
      className={cx(
        styles.progressIndication,
        className,
        progressIndicationElement
      )}
      data-is-subchapter={isSubChapter}
      style={style}>
      {Array.from({length: length > 1 ? length : 2}).map((_, index) => (
        <span
          key={index}
          data-is-selected={index === selectedChapterIndex}
          onClick={() =>
            // Todo: Refactor
            // 1. Get rid of nested turning
            // 2. Only works because there is currently just one subchapter
            // 3. Code is duplicated from nav-chapter-overview.ts
            // eslint-disable-next-line no-nested-ternary
            scrollToChapterIndex(isSubChapter ? (index === 0 ? 5 : 6) : index)
          }
        />
      ))}
    </div>
  );
};

export default ChapterProgressIndication;
