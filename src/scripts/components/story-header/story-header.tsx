import React, {FunctionComponent, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link, useHistory} from 'react-router-dom';
import cx from 'classnames';

import {StoryListItem} from '../../types/story-list';
import {StoryMode} from '../../types/story-mode';

import styles from './story-header.styl';

interface Props {
  storyIds?: string;
  mode: StoryMode;
  story: StoryListItem;
}

const StoryHeader: FunctionComponent<Props> = ({storyIds, story, mode}) => {
  const history = useHistory();
  const isPresenterMode = mode === StoryMode.Present;
  const isShowcaseMode = mode === StoryMode.Showcase;
  const backLink = storyIds ? `/showcase/${storyIds}` : `/${mode}`;
  const storyClasses = cx(
    styles.storyHeader,
    isPresenterMode && styles.present,
    isShowcaseMode && styles.showcase
  );

  const onKeyDownHandler = (event: KeyboardEvent) => {
    // 27 - esc
    if (event.keyCode === 27) {
      history.push(backLink);
    }
  };

  // add and remove event listener for keyboard events
  useEffect(() => {
    window.addEventListener('keydown', onKeyDownHandler);
    return () => {
      window.removeEventListener('keydown', onKeyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={storyClasses}>
      {!isPresenterMode && (
        <Link to={backLink} className={styles.backButton}>
          <FormattedMessage id="goBack" />
        </Link>
      )}
      <div>
        <h2 className={styles.title}>{story && story.title}</h2>
        {isShowcaseMode && (
          <h3 className={styles.subtitle}>{story && story.description}</h3>
        )}
      </div>
    </div>
  );
};

export default StoryHeader;
