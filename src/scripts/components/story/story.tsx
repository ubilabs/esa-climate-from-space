import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect} from 'react-router-dom';

import StoryPagination from '../story-pagination/story-pagination';
import fetchStory from '../../actions/fetch-story';
import {selectedStorySelector} from '../../selectors/story/selected';
import {storyListSelector} from '../../selectors/story/list';
import setFlyToAction from '../../actions/set-fly-to';
import Slide from '../slide/slide';
import {State} from '../../reducers';
import config from '../../config/main';
import StoryHeader from '../story-header/story-header';

import {StoryMode} from '../../types/story-mode';

import styles from './story.styl';

interface Props {
  mode: StoryMode;
}

// eslint-disable-next-line
const Story: FunctionComponent<Props> = ({mode}) => {
  const {
    storyIds: storyIdsString,
    storyNumber,
    storyId: storyModeStoryId,
    page
  } = useParams();
  let storyId: string | null = null;

  if (mode === StoryMode.Showcase) {
    const storyIds = storyIdsString?.split('&');
    const storyIndex = parseInt(storyNumber || '0', 10);
    storyId = (storyIds && storyIds[storyIndex || 0]) || null;
  } else {
    storyId = storyModeStoryId || null;
  }
  const story = useSelector((state: State) =>
    selectedStorySelector(state, storyId)
  );
  const stories = useSelector(storyListSelector);
  const dispatch = useDispatch();
  const pageNumber = parseInt(page || '0', 10);
  const slide = story?.slides[pageNumber];
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

  return (
    <div className={styles.story}>
      {storyListItem && <StoryHeader story={storyListItem} mode={mode} />}

      {/* Instead of rendering only the currect slide we map over all slides to
        enforce a newly mounted component when the pageNumber changes */}
      {story?.slides.map(
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
