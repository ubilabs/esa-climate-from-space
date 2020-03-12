import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {storyListSelector} from '../../selectors/story/list';

import {StoryMode} from '../../types/story-mode';

import styles from './story-header.styl';

interface Props {
  mode: StoryMode;
  storyIds: string[];
}

const StoryHeader: FunctionComponent<Props> = ({mode, storyIds}) => {
  const storyList = useSelector(storyListSelector);
  const storyId = storyIds[0];
  const currentStory = storyList.find(story => story.id === storyId);
  const backLink = `/${mode}`;

  return (
    <div className={styles.storyHeader}>
      <Link to={backLink} className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
      <h1 className={styles.title}>{currentStory?.title}</h1>
    </div>
  );
};

export default StoryHeader;
