import React, {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';

import {useStoryParams} from '../../hooks/use-story-params';
import {useInterval} from '../../hooks/use-interval';

import styles from './story-title.styl';

const StoryTitle: FunctionComponent = () => {
  const {storyIds, storyIndex, storyListItem} = useStoryParams();
  const history = useHistory();
  const showcaseStoryIds = storyIds.join('&');
  const nextLink = `/showcase/${showcaseStoryIds}/${storyIndex}/0`;

  useInterval(() => {
    history.replace(nextLink);
  }, 3000);

  return (
    <div className={styles.storyTitle}>
      <h1 className={styles.title}>{storyListItem?.title}</h1>
      <h2 className={styles.description}>{storyListItem?.description}</h2>
    </div>
  );
};

export default StoryTitle;
