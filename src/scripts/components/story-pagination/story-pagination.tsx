import React, {FunctionComponent, useCallback, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useIntl} from 'react-intl';
import cx from 'classnames';

import {PreviousIcon} from '../icons/previous-icon';
import {NextIcon} from '../icons/next-icon';
import {CloseIcon} from '../icons/close-icon';
import {useStoryNavigation} from '../../hooks/use-story-navigation';

import {StoryMode} from '../../types/story-mode';
import {Story} from '../../types/story';

import styles from './story-pagination.styl';

interface Props {
  mode: StoryMode | null;
  slideIndex: number;
  selectedStory: Story | null;
}

const StoryPagination: FunctionComponent<Props> = ({
  mode,
  slideIndex,
  selectedStory
}) => {
  const intl = useIntl();
  const history = useHistory();
  const storyNavigation = useStoryNavigation();
  const {nextSlideLink, previousSlideLink} = storyNavigation;
  const isShowcaseMode = mode === StoryMode.Showcase;
  const isPresenterMode = mode === StoryMode.Present;

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

  const iconClasses = cx(styles.disabled, isShowcaseMode && styles.emptyIcon);

  return (
    <div className={styles.pagination}>
      <div className={styles.controls}>
        {previousSlideLink ? (
          <Link to={previousSlideLink} className={styles.icon}>
            <PreviousIcon />
          </Link>
        ) : (
          <div className={iconClasses}>
            <PreviousIcon />
          </div>
        )}

        <span className={styles.slides}>
          {slideIndex + 1}/{selectedStory?.slides.length}
        </span>

        {nextSlideLink ? (
          <Link to={nextSlideLink} className={styles.icon}>
            <NextIcon />
          </Link>
        ) : (
          <div className={iconClasses}>
            <NextIcon />
          </div>
        )}

        {isPresenterMode && (
          <div className={styles.closeIcon}>
            <Link
              to={`/${mode}`}
              title={intl.formatMessage({id: 'closeStory'})}>
              <CloseIcon />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPagination;
