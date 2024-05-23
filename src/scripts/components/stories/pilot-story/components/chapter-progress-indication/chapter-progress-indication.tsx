import React, {FunctionComponent, useRef} from 'react';

import {useChapter} from '../../hooks/use-chapter';

import {dataIsTitleInView, progressIndicationElement} from '../../config/main';
import {ChapterPosition} from '../../types/globe';

import cx from 'classnames';

import styles from './chapter-progress-indication.module.styl';
import {useHistory} from 'react-router-dom';

interface Props {
  chapters: Record<'title' | 'subtitle', string>[];
  gap?: number;
  className?: string;
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
const ChapterProgressIndication: FunctionComponent<Props> = ({
  chapters,
  className,
  gap = 24
}) => {
  // The gap between the chapter symbols
  // Can be set to any value in px (defaults to 24px)
  const style = {
    '--gap': `${gap}px`
  } as React.CSSProperties;

  const {selectedChapterIndex, chapterPosition, progress} = useChapter();

  const indicationRef = useRef<HTMLDivElement>(null);

  const history = useHistory();

  if (indicationRef.current) {
    if (chapterPosition === ChapterPosition.CONTENT) {
      indicationRef.current.setAttribute(dataIsTitleInView, 'false');

      const progressIndicatorHeight = indicationRef.current.clientHeight;
      const chaptersLength = chapters.length;

      if (progressIndicatorHeight && chaptersLength) {
        const indicatorYOffsetInPx =
          (progressIndicatorHeight / chaptersLength + 1) *
            selectedChapterIndex +
          (progressIndicatorHeight / chaptersLength + 1) * progress;

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
      style={style}>
      {Array.from({length: chapters.length}).map((_, index) => (
        <span
          key={index}
          data-is-selected={index === selectedChapterIndex}
          onClick={() => history.push(`/stories/pilot/${index}`)}
        />
      ))}
    </div>
  );
};

export default ChapterProgressIndication;
