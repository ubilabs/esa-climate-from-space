import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {storiesSelector} from '../../reducers/stories';
import fetchStories from '../../actions/fetch-stories';
import StoryItem from '../story-item/story-item';

import styles from './story-list.styl';

const StoryList: FunctionComponent = () => {
  const stories = useSelector(storiesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  return (
    <div className={styles.storyList}>
      {stories.map(story => (
        <StoryItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default StoryList;
