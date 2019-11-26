import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {useIntl} from 'react-intl';
import cx from 'classnames';

import {PreviousIcon} from '../icons/previous-icon';
import {NextIcon} from '../icons/next-icon';
import {PlayIcon} from '../icons/play-icon';
import {RemoveIcon} from '../icons/remove-icon';
import {useStoryNavigation} from '../../libs/get-navigation-links';

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
  mode,
  slides
}) => {
  const intl = useIntl();
  const isPresenterMode = mode === StoryMode.Present;
  const classes = cx(styles.pagination, isPresenterMode && styles.present);

  const {previousLink, showPrevious, nextLink, showNext} = useStoryNavigation(
    slides,
    currentPage
  );

  return (
    <div className={classes}>
      <div className={styles.controls}>
        {showPrevious ? (
          <Link to={previousLink} className={styles.icon}>
            <PreviousIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}

        <span>
          {currentPage + 1}/{slides.length}
        </span>

        {showNext ? (
          <Link to={nextLink} className={styles.icon}>
            <NextIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}

        {isPresenterMode && (
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
