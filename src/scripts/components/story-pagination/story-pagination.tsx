import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {useIntl} from 'react-intl';
import cx from 'classnames';

import {PreviousIcon} from '../icons/previous-icon';
import {NextIcon} from '../icons/next-icon';
import {PlayIcon} from '../icons/play-icon';
import {RemoveIcon} from '../icons/remove-icon';

import {Slide} from '../../types/story';
import {StoryMode} from '../../types/story-mode';

import styles from './story-pagination.styl';

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
  const intl = useIntl();
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
            <PlayIcon />
            <Link
              to={`/${mode}`}
              title={intl.formatMessage({id: 'closeStory'})}>
              <RemoveIcon />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPagination;
