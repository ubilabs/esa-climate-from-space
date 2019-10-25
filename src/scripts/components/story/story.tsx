import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect, Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryPagination from '../story-pagination/story-pagination';
import fetchStory from '../../actions/fetch-story';
import {storySelector} from '../../reducers/story';
import {storiesSelector} from '../../reducers/stories';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const story = useSelector(storySelector);
  const dispatch = useDispatch();
  const {storyId, page} = useParams();
  const pageNumber = parseInt(page || '0', 10);
  const slide = story && story.slides[pageNumber];
  const activeStoryId = story && story.id;
  const stories = useSelector(storiesSelector);
  const findStory = stories.find(storyItem => storyItem.id === storyId);

  useEffect(() => {
    storyId && dispatch(fetchStory(storyId));
  }, [storyId, dispatch]);

  // redirect to first slide when current slide does not exist
  if (story && !slide) {
    return <Redirect to={`/stories/${storyId}/0`} />;
  }

  // only render matching story
  if (activeStoryId !== storyId) {
    return null;
  }

  return (
    <div className={styles.story}>
      <div className={styles.header}>
        <Link to="/stories" className={styles.backButton}>
          <FormattedMessage id="goBack" />
        </Link>
        <h2 className={styles.storyTitle}>{findStory && findStory.title}</h2>
      </div>
      {slide && (
        <div className={styles.sidepanel} key={slide.title}>
          <img src={slide.image} className={styles.previewImage} />
          <div className={styles.content}>
            <h1>{slide.title}</h1>
            <p>{slide.bodytext}</p>
          </div>
        </div>
      )}
      {story && (
        <StoryPagination
          currentPage={pageNumber}
          storyId={story.id}
          slides={story.slides}
        />
      )}
    </div>
  );
};

export default Story;
