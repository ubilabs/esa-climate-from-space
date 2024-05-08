import React, {FunctionComponent} from 'react';

import cx from 'classnames';
import styles from './chapter-progress-indication.module.styl';

interface Props {
  chapters: Record<'title' | 'subtitle', string>[];
  selectedChapterIndex: number;
  gap?: number;
  className?: string;
}

const ChapterProgressIndication: FunctionComponent<Props> = ({
  chapters,
  selectedChapterIndex,
  className,
  gap = 24
}) => {
  // The gap between the chapter symbols
  // Can be set to any value in px
  const style = {
    '--gap': `${gap}px`
  } as React.CSSProperties;

  return (
    <div className={cx(styles.progressIndication, className)} style={style}>
      {Array.from({length: chapters.length}).map((_, index) => (
        <span key={index} data-is-selected={index === selectedChapterIndex} />
      ))}
    </div>
  );
};

export default ChapterProgressIndication;
