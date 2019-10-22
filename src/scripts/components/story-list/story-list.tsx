import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {storiesSelector} from '../../reducers/stories';
import fetchStories from '../../actions/fetch-stories';
import StoryListItem from '../story-list-item/story-list-item';

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
        <StoryListItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default StoryList;
