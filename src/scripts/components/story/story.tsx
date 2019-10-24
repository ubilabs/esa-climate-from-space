import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect, Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import fetchStory from '../../actions/fetch-story';
import {storySelector} from '../../reducers/story';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const story = useSelector(storySelector);
  const dispatch = useDispatch();
  const {storyId, page} = useParams();
  const pageNumber = parseInt(page || '0', 10);
  const slide = story && story.slides[pageNumber];
  const activeStoryId = story && story.id;

  useEffect(() => {
    storyId && dispatch(fetchStory(storyId));
  }, [storyId, dispatch]);

  if (!slide) {
    return <Redirect to={`/stories/${storyId}/0`} />;
  }

  if (activeStoryId !== storyId) {
    return null;
  }

  return (
    <div className={styles.story}>
      <Link to="/stories" className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
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
