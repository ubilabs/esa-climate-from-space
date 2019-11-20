import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect, Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import cx from 'classnames';

import StoryPagination from '../story-pagination/story-pagination';
import fetchStory from '../../actions/fetch-story';
import {selectedStorySelector} from '../../selectors/story/selected';
import {storyListSelector} from '../../selectors/story/list';
import setFlyToAction from '../../actions/set-fly-to';
import Slide from '../slide/slide';
import {State} from '../../reducers';
import config from '../../config/main';

import {StoryMode} from '../../types/story-mode';

import styles from './story.styl';

interface Props {
  mode: StoryMode;
}

const Story: FunctionComponent<Props> = ({mode}) => {
  const {storyId, page} = useParams();
  const story = useSelector((state: State) =>
    selectedStorySelector(state, storyId)
  );
  const stories = useSelector(storyListSelector);
  const dispatch = useDispatch();
  const pageNumber = parseInt(page || '0', 10);
  const slide = story && story.slides[pageNumber];
  const storyListItem = stories.find(storyItem => storyItem.id === storyId);
  const defaultView = config.globe.view;

  // fetch story of active storyId
  useEffect(() => {
    storyId && dispatch(fetchStory(storyId));
  }, [dispatch, storyId]);

  // fly to position given in a slide, if none given set to default
  useEffect(() => {
    if (slide) {
      dispatch(setFlyToAction(slide.flyTo || defaultView));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, slide]);

  // redirect to first slide when current slide does not exist
  if (story && !slide) {
    return <Redirect to={`/${mode}/${storyId}/0`} />;
  }

  const storyClasses = cx(
    styles.story,
    mode === 'present' && styles.presentStory
  );

  return (
    <div className={storyClasses}>
      <div className={styles.header}>
        <Link to={`/${mode}`} className={styles.backButton}>
          <FormattedMessage id="goBack" />
        </Link>
        <h2 className={styles.storyTitle}>
          {storyListItem && storyListItem.title}
        </h2>
      </div>

      {/* Instead of rendering only the currect slide we map over all slides to
        enforce a newly mounted component when the pageNumber changes */}
      {story &&
        story.slides.map(
          (currentSlide, index) =>
            index === pageNumber && (
              <Slide mode={mode} slide={currentSlide} key={index} />
            )
        )}

      {story && (
        <StoryPagination
          currentPage={pageNumber}
          storyId={story.id}
          mode={mode}
          slides={story.slides}
        />
      )}
    </div>
  );
};

export default Story;
