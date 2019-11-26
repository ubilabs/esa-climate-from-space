import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect, useLocation, useHistory} from 'react-router-dom';

import StoryPagination from '../story-pagination/story-pagination';
import fetchStory from '../../actions/fetch-story';
import {selectedStorySelector} from '../../selectors/story/selected';
import {storyListSelector} from '../../selectors/story/list';
import setFlyToAction from '../../actions/set-fly-to';
import Slide from '../slide/slide';
import {State} from '../../reducers';
import config from '../../config/main';
import StoryHeader from '../story-header/story-header';
import {useInterval} from '../../hooks/use-interval';
import {getStorySlideNavigation} from '../../libs/get-story-slide-navigation';
import {getStoryNavigation} from '../../libs/get-story-navigation';

import {StoryMode} from '../../types/story-mode';

import styles from './story.styl';

interface Props {
  mode: StoryMode;
}

interface Params {
  storyId?: string;
  storyIds?: string;
  storyNumber?: string;
  page?: string;
}

const getStoryId = (params: Params, mode: StoryMode) => {
  if (mode === StoryMode.Showcase) {
    const storyIds = params.storyIds?.split('&');
    const storyIndex = parseInt(params.storyNumber || '0', 10);
    return (storyIds && storyIds[storyIndex || 0]) || null;
  }

  return params.storyId || null;
};

const Story: FunctionComponent<Props> = ({mode}) => {
  const params = useParams<Params>();
  const {pathname} = useLocation();
  const history = useHistory();
  const storyId = getStoryId(params, mode);
  const currentStory = parseInt(params.storyNumber || '0', 10);
  const showcaseMode = mode === StoryMode.Showcase;
  const story = useSelector((state: State) =>
    selectedStorySelector(state, storyId)
  );
  const stories = useSelector(storyListSelector);
  const dispatch = useDispatch();
  const pageNumber = parseInt(params.page || '0', 10);
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

  // clean up story fly to on unmount
  useEffect(
    () => () => {
      dispatch(setFlyToAction(null));
    },
    [dispatch]
  );

  const navigationData = getStorySlideNavigation({
    pathname,
    pageNumber,
    slides: story?.slides
  });

  const storyPath = getStoryNavigation(
    pathname,
    mode,
    currentStory,
    params.storyIds
  );

  const showNext = navigationData?.showNext;
  const showPrevious = navigationData?.showPrevious;
  const nextLink = navigationData?.nextLink;
  const previousLink = navigationData?.previousLink;
  const showNextStory = storyPath?.showNextStory;
  const nextStoryPath = storyPath?.nextStoryPath;
  const initialPath = storyPath?.initialPath;

  useInterval(() => {
    if (showcaseMode) {
      showNext && history.replace(`${nextLink}`);
      !showNext && showNextStory && history.replace(`${nextStoryPath}`);
      !showNextStory && history.replace(`${initialPath}`);
    }
  }, 5000);

  // redirect to first slide when current slide does not exist
  if (story && !slide && !showcaseMode) {
    return <Redirect to={`/${mode}/${storyId}/0`} />;
  }

  return (
    <div className={styles.story}>
      {storyListItem && (
        <StoryHeader
          story={storyListItem}
          mode={mode}
          storyIds={params.storyIds}
        />
      )}

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
          previousLink={previousLink}
          showPrevious={showPrevious}
          nextLink={nextLink}
          showNext={showNext}
        />
      )}
    </div>
  );
};

export default Story;
