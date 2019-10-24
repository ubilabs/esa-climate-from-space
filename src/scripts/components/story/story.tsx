/* eslint-disable complexity */
import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect, Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import fetchStory from '../../actions/fetch-story';
import {storySelector} from '../../reducers/story';
import {BackIcon} from '../icons/back-icon';
import {NextIcon} from '../icons/next-icon';

import styles from './story.styl';

const Story: FunctionComponent = () => {
  const story = useSelector(storySelector);
  const dispatch = useDispatch();
  const {storyId, page} = useParams();
  const pageNumber = parseInt(page || '0', 10);
  const slide = story && story.slides[pageNumber];
  const activeStoryId = story && story.id;
  const nextPageNumber = pageNumber + 1;
  const previousPageNumber = pageNumber - 1;
  const slidesLength = (story && story.slides.length) || 0;
  const showNextButton = nextPageNumber < slidesLength;
  const showPreviousButton = previousPageNumber >= 0;

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
      <Link to="/stories" className={styles.backButton}>
        <FormattedMessage id="goBack" />
      </Link>
      {slide && (
        <div className={styles.sidepanel} key={slide.title}>
          <img src={slide.image} className={styles.previewImage} />
          <div className={styles.content}>
            <h1>{slide.title}</h1>
            <p>{slide.bodytext}</p>
          </div>
        </div>
      )}
      <div className={styles.pagination}>
        {showPreviousButton ? (
          <Link
            to={`/stories/${storyId}/${previousPageNumber}`}
            className={styles.icon}>
            <BackIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}
        <span>
          {pageNumber + 1}/{slidesLength}
        </span>
        {showNextButton ? (
          <Link
            to={`/stories/${storyId}/${nextPageNumber}`}
            className={styles.icon}>
            <NextIcon />
          </Link>
        ) : (
          <div className={styles.emptyIcon} />
        )}
      </div>
    </div>
  );
};

export default Story;
