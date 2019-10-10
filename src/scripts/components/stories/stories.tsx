import React, {FunctionComponent, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {storiesSelector} from '../../reducers/stories';
import fetchStories from '../../actions/fetch-stories';

import styles from './stories.styl';

const Stories: FunctionComponent<{}> = () => {
  const stories = useSelector(storiesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStories());
  }, []);

  return (
    <div className={styles.storyContainer}>
      <h2>Stories</h2>
      {console.log('stories', stories)}
    </div>
  );
};

export default Stories;
