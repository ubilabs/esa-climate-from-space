import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
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
  const isPresenterMode = mode === StoryMode.Present;
  const isShowcaseMode = mode === StoryMode.Showcase;

  const storyClasses = cx(
    styles.storyHeader,
    isPresenterMode && styles.present,
    isShowcaseMode && styles.showcase
  );

  const backLink = storyIds ? `/showcase/${storyIds}` : `/${mode}`;

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
