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
  const isPresent = mode === StoryMode.Present;
  const isShowcase = mode === StoryMode.Showcase;

  const storyClasses = cx(
    styles.storyHeader,
    isPresent && styles.present,
    isShowcase && styles.showcase
  );

  const backLink = storyIds ? `/showcase/${storyIds}` : `/${mode}`;

  return (
    <div className={storyClasses}>
      {!isPresent && (
        <Link to={backLink} className={styles.backButton}>
          <FormattedMessage id="goBack" />
        </Link>
      )}
      <div>
        <h2 className={styles.title}>{story && story.title}</h2>
        {isShowcase && (
          <h3 className={styles.subtitle}>{story && story.description}</h3>
        )}
      </div>
    </div>
  );
};

export default StoryHeader;
