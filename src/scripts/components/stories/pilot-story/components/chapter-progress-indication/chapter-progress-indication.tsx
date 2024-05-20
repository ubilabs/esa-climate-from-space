import React, {FunctionComponent} from 'react';

import cx from 'classnames';
import styles from './chapter-progress-indication.module.styl';
import {useChapter} from '../../hooks/use-chapter';

interface Props {
  chapters: Record<'title' | 'subtitle', string>[];
  gap?: number;
  className?: string;
}

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

  const {selectedChapterIndex} = useChapter();

  return (
    <div
      className={cx(styles.progressIndication, className)}
      style={style}
      id="progress-indication">
      {Array.from({length: chapters.length + 1}).map((_, index) => (
        <span key={index} data-is-selected={index === selectedChapterIndex} />
      ))}
    </div>
  );
};

export default ChapterProgressIndication;
