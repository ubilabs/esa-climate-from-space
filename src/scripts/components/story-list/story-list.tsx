import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {storiesSelector} from '../../reducers/stories';
import StoryListItem from '../story-list-item/story-list-item';

import styles from './story-list.styl';

const StoryList: FunctionComponent = () => {
  const stories = useSelector(storiesSelector);

  return (
    <div className={styles.storyList}>
      {stories.map(story => (
        <StoryListItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default StoryList;
