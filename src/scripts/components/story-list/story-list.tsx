import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {storiesSelector} from '../../reducers/stories';
import fetchStories from '../../actions/fetch-stories';
import styles from './story-list.styl';
import StoryItem from '../story-item/story-item';

interface Story {
  id: string;
  title: string;
}

const StoryList: FunctionComponent<{}> = () => {
  const stories = useSelector(storiesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStories());
  }, []);

  return (
    <div className={styles.stories}>
      {stories.map(story => (
        <StoryItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default StoryList;
