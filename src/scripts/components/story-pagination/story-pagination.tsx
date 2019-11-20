import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import cx from 'classnames';

import {PreviousIcon} from '../icons/back-icon';
import {NextIcon} from '../icons/next-icon';
import {PlayIcon} from '../icons/play-icon';

import {Slide} from '../../types/story';
import {StoryMode} from '../../types/story-mode';

import styles from './story-pagination.styl';
import {RemoveIcon} from '../icons/remove-icon';

interface Props {
  currentPage: number;
  storyId: string;
  mode: StoryMode;
  slides: Slide[];
}

const StoryPagination: FunctionComponent<Props> = ({
  currentPage,
  storyId,
  mode,
  slides
}) => {
  const nextPageNumber = currentPage + 1;
  const previousPageNumber = currentPage - 1;
  const slidesLength = slides.length;
  const showNextButton = nextPageNumber < slidesLength;
  const showPreviousButton = previousPageNumber >= 0;

  const presenterMode = mode === StoryMode.Present;

  const classes = cx(styles.pagination, presenterMode && styles.present);

  return (
    <div className={classes}>
      <div className={styles.controls}>
        {showPreviousButton ? (
          <Link
            to={`/${mode}/${storyId}/${previousPageNumber}`}
            className={styles.icon}>
            <PreviousIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}
        <span>
          {currentPage + 1}/{slidesLength}
        </span>
        {showNextButton ? (
          <Link
            to={`/${mode}/${storyId}/${nextPageNumber}`}
            className={styles.icon}>
            <NextIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}
        {presenterMode && (
          <div className={styles.icons}>
            <PlayIcon /> <RemoveIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPagination;
