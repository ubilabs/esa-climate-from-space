import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect, Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import StoryPagination from '../story-pagination/story-pagination';
import fetchStory from '../../actions/fetch-story';
import {selectedStorySelector} from '../../reducers/story/selected';
import {storyListSelector} from '../../reducers/story/list';
import setFlyToAction from '../../actions/set-fly-to';
import Slide from '../slide/slide';

import styles from './story.styl';
import {State} from '../../reducers';

const Story: FunctionComponent = () => {
  const {storyId, page} = useParams();
  const story = useSelector((state: State) =>
    selectedStorySelector(state, storyId)
  );
  const stories = useSelector(storyListSelector);
  const dispatch = useDispatch();
  const pageNumber = parseInt(page || '0', 10);
  const slide = story && story.slides[pageNumber];
  const storyListItem = stories.find(storyItem => storyItem.id === storyId);

  // fetch story of active storyId
  useEffect(() => {
    storyId && dispatch(fetchStory(storyId));
  }, [dispatch, storyId]);

  // fly to position given in a slide
  useEffect(() => {
    if (slide && slide.flyTo) {
      dispatch(setFlyToAction(slide.flyTo));
    }
  }, [dispatch, slide]);

  // redirect to first slide when current slide does not exist
  if (story && !slide) {
    return <Redirect to={`/stories/${storyId}/0`} />;
  }

  return (
    <div className={styles.story}>
      <div className={styles.header}>
        <Link to="/stories" className={styles.backButton}>
          <FormattedMessage id="goBack" />
        </Link>
        <h2 className={styles.storyTitle}>
          {storyListItem && storyListItem.title}
        </h2>
      </div>
      {slide && <Slide slide={slide} />}
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
