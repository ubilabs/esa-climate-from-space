import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';

import fetchStory from '../../actions/fetch-story';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {storyId} = useParams();

  useEffect(() => {
    storyId && dispatch(fetchStory(storyId));
  }, [storyId, dispatch]);

  return (
    <div className={styles.story}>
      <div className={styles.sidepanel}>
        <div className={styles.previewImage}></div>
        <div className={styles.content}>
          <h1>Test</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor optio
            nisi nobis quas ut. Exercitationem, sapiente. Praesentium quidem
            mollitia explicabo voluptatem aperiam deleniti ut sunt atque eaque,
            voluptate commodi in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story;
