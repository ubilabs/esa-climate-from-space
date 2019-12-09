import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Redirect} from 'react-router-dom';

import StoryPagination from '../story-pagination/story-pagination';
import fetchStory from '../../actions/fetch-story';
import {selectedStorySelector} from '../../selectors/story/selected';
import {storyListSelector} from '../../selectors/story/list';
import setFlyToAction from '../../actions/set-fly-to';
import setStoryLayerAction from '../../actions/set-story-layer';
import Slide from '../slide/slide';
import {State} from '../../reducers';
import config from '../../config/main';
import StoryHeader from '../story-header/story-header';
import {getNavigationData} from '../../libs/get-navigation-data';
import Autoplay from '../autoplay/autoplay';
import setGlobeTimeAction from '../../actions/set-globe-time';
import setGlobeProjectionAction from '../../actions/set-globe-projection';

import {StoryMode} from '../../types/story-mode';
import {GlobeProjection} from '../../types/globe-projection';

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
  const sphereProjection = GlobeProjection.Sphere;
  const storyId = getStoryId(params, mode);
  const storyIds = params.storyIds;
  const storyIndex = parseInt(params.storyNumber || '0', 10);
  const isShowcaseMode = mode === StoryMode.Showcase;
  const story = useSelector((state: State) =>
    selectedStorySelector(state, storyId)
  );
  const stories = useSelector(storyListSelector);
  const dispatch = useDispatch();
  const slideIndex = parseInt(params.page || '0', 10);
  const slide = story?.slides[slideIndex];
  const storyListItem = stories.find(storyItem => storyItem.id === storyId);
  const defaultView = config.globe.view;
  const {autoPlayLink, nextSlideLink, previousSlideLink} = getNavigationData({
    mode,
    storyId,
    storyIndex,
    slideIndex,
    storyIds,
    numberOfSlides: story?.slides.length
  });

  // fetch story of active storyId
  useEffect(() => {
    storyId && dispatch(fetchStory(storyId));
    dispatch(setGlobeProjectionAction(sphereProjection, 0));
  }, [dispatch, storyId, sphereProjection]);

  // fly to position given in a slide, if none given set to default
  // set layer given by story slide
  useEffect(() => {
    if (slide) {
      dispatch(setFlyToAction(slide.flyTo || defaultView));
      dispatch(setStoryLayerAction(slide.layer?.id || null));
      dispatch(setGlobeTimeAction(slide.layer?.timestamp || 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, slide]);

  // clean up story fly to on unmount
  useEffect(
    () => () => {
      dispatch(setFlyToAction(null));
      dispatch(setStoryLayerAction(null));
      dispatch(setGlobeTimeAction(0));
    },
    [dispatch]
  );

  // redirect to first slide when current slide does not exist
  if (story && !slide) {
    return isShowcaseMode ? (
      <Redirect to="/showcase" />
    ) : (
      <Redirect to={`/${mode}/${storyId}/0`} />
    );
  }

  return (
    <div className={styles.story}>
      {storyListItem && (
        <StoryHeader story={storyListItem} mode={mode} storyIds={storyIds} />
      )}

      {/* Instead of rendering only the currect slide we map over all slides to
        enforce a newly mounted component when the pageNumber changes */}
      {story?.slides.map(
        (currentSlide, index) =>
          index === slideIndex && (
            <Slide mode={mode} slide={currentSlide} key={index} />
          )
      )}

      {story && (
        <StoryPagination
          mode={mode}
          slideIndex={slideIndex}
          numberOfSlides={story.slides.length}
          previousSlideLink={previousSlideLink}
          nextSlideLink={nextSlideLink}
        />
      )}

      {isShowcaseMode && <Autoplay autoPlayLink={autoPlayLink} />}
    </div>
  );
};

export default Story;
