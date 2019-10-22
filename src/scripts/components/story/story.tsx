import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect} from 'react-router-dom';

import fetchStory from '../../actions/fetch-story';
import {storySelector} from '../../reducers/story';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const story = useSelector(storySelector);
  const dispatch = useDispatch();
  const {storyId, page} = useParams();
  const pageNumber = parseInt(page || '0', 10);
  const slide = story && story.slides[pageNumber];

  useEffect(() => {
    storyId && dispatch(fetchStory(storyId));
  }, [storyId, dispatch]);

  if (!slide) {
    return <Redirect to={`/stories/${storyId}/0`} />;
  }

  return (
    <div className={styles.story}>
      {story && (
        <div className={styles.sidepanel} key={slide.title}>
          <img src={slide.image} className={styles.previewImage} />
          <div className={styles.content}>
            <h1>{slide.title}</h1>
            <p>{slide.bodytext}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Story;
