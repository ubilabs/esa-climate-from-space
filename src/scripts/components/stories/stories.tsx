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
    <div className={styles.stories}>
      <h2>{stories.length && stories[0].title}</h2>
    </div>
  );
};

export default Stories;
