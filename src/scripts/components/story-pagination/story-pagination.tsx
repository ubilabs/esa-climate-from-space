import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {useIntl} from 'react-intl';
import cx from 'classnames';

import {PreviousIcon} from '../icons/previous-icon';
import {NextIcon} from '../icons/next-icon';
import {RemoveIcon} from '../icons/remove-icon';

import {StoryMode} from '../../types/story-mode';

import styles from './story-pagination.styl';

interface Props {
  mode: StoryMode;
  slideIndex: number;
  numberOfSlides: number;
  previousSlideLink?: string | null;
  nextSlideLink?: string | null;
}

const StoryPagination: FunctionComponent<Props> = ({
  mode,
  slideIndex,
  numberOfSlides,
  previousSlideLink,
  nextSlideLink
}) => {
  const intl = useIntl();
  const isPresenterMode = mode === StoryMode.Present;
  const classes = cx(styles.pagination, isPresenterMode && styles.present);

  return (
    <div className={classes}>
      <div className={styles.controls}>
        {previousSlideLink ? (
          <Link to={previousSlideLink} className={styles.icon}>
            <PreviousIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}

        <span>
          {slideIndex + 1}/{numberOfSlides}
        </span>

        {nextSlideLink ? (
          <Link to={nextSlideLink} className={styles.icon}>
            <NextIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}

        {isPresenterMode && (
          <div className={styles.icons}>
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
