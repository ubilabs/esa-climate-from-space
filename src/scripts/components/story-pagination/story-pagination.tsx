import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';

import {BackIcon} from '../icons/back-icon';
import {NextIcon} from '../icons/next-icon';

import {Slide} from '../../types/story';

import styles from './story-pagination.styl';

interface Props {
  currentPage: number;
  storyId: string;
  slides: Slide[];
}

const StoryPagination: FunctionComponent<Props> = ({
  currentPage,
  storyId,
  slides
}) => {
  const nextPageNumber = currentPage + 1;
  const previousPageNumber = currentPage - 1;
  const slidesLength = slides.length;
  const showNextButton = nextPageNumber < slidesLength;
  const showPreviousButton = previousPageNumber >= 0;

  return (
    <div className={styles.pagination}>
      {showPreviousButton ? (
        <Link
          to={`/stories/${storyId}/${previousPageNumber}`}
          className={styles.icon}>
          <BackIcon />
        </Link>
      ) : (
        <div className={styles.emptyIcon} />
      )}
      <span>
        {currentPage + 1}/{slidesLength}
      </span>
      {showNextButton ? (
        <Link
          to={`/stories/${storyId}/${nextPageNumber}`}
          className={styles.icon}>
          <NextIcon />
        </Link>
      ) : (
        <div className={styles.emptyIcon} />
      )}
    </div>
  );
};

export default StoryPagination;
