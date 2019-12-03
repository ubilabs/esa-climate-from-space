import React, {FunctionComponent, useEffect, useCallback} from 'react';
import {Link, useHistory} from 'react-router-dom';
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
  const history = useHistory();
  const intl = useIntl();
  const isPresenterMode = mode === StoryMode.Present;
  const isShowcaseMode = mode === StoryMode.Showcase;
  const classes = cx(styles.pagination, isPresenterMode && styles.present);

  const onKeyDownHandler = useCallback(
    event => {
      if (!isShowcaseMode) {
        // 37-arrow left, 33-page up, 38-arrow down
        if (
          event.keyCode === 33 ||
          event.keyCode === 37 ||
          event.keyCode === 38
        ) {
          previousSlideLink && history.push(previousSlideLink);
        }
        // 39-arrow right, 34-page down, 40-arrow down
        if (
          event.keyCode === 34 ||
          event.keyCode === 39 ||
          event.keyCode === 40
        ) {
          nextSlideLink && history.push(nextSlideLink);
        }
      }
    },
    [isShowcaseMode, history, previousSlideLink, nextSlideLink]
  );

  // add and remove event listener for keyboard events
  useEffect(() => {
    window.addEventListener('keydown', onKeyDownHandler);
    return () => {
      window.removeEventListener('keydown', onKeyDownHandler);
    };
  }, [onKeyDownHandler]);

  return (
    <div className={classes}>
      <div className={styles.controls}>
        {previousSlideLink && !isShowcaseMode ? (
          <Link to={previousSlideLink} className={styles.icon}>
            <PreviousIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}

        <span>
          {slideIndex + 1}/{numberOfSlides}
        </span>

        {nextSlideLink && !isShowcaseMode ? (
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
