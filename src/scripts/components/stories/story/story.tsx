import React, {FunctionComponent, useEffect, useState} from 'react';
import {YouTubePlayer} from 'youtube-player/dist/types';
import {VideoJsPlayer} from 'video.js';

import DataViewer from '../../main/data-viewer/data-viewer';
import {useStoryParams} from '../../../hooks/use-story-params';
import StoryContent from '../story-content/story-content';
import StoryGallery from '../story-gallery/story-gallery';
import StoryFooter from '../story-footer/story-footer';
import fetchStory from '../../../actions/fetch-story';
import Header from '../header/header';
import StoryVideo from '../story-video/story-video';
import setGlobeProjectionAction from '../../../actions/set-globe-projection';
import setSelectedLayerIdsAction from '../../../actions/set-selected-layer-id';
import setGlobeTimeAction from '../../../actions/set-globe-time';
import Share from '../../main/share/share';
import SplashScreen from '../splash-screen/splash-screen';
import LayerDescription from '../layer-description/layer-description';
import TimeSlider from '../../layers/time-slider/time-slider';

import {SlideType} from '../../../types/slide-type';
import {GlobeProjection} from '../../../types/globe-projection';
import {StoryMode} from '../../../types/story-mode';
import {Slide, Story as StoryType} from '../../../types/story';
import {useThunkDispatch} from '../../../hooks/use-thunk-dispatch';

import styles from './story.module.styl';

const Story: FunctionComponent = () => {
  const storyParams = useStoryParams();
  const sphereProjection = GlobeProjection.Sphere;
  const dispatch = useThunkDispatch();
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const {
    mode,
    slideIndex,
    currentStoryId,
    selectedStory,
    storyListItem
  } = storyParams;
  const storyMode = mode === StoryMode.Stories;

  const isSplashScreen =
    selectedStory?.slides[slideIndex].type === SlideType.Splashscreen;

  // fetch story of active storyId
  useEffect(() => {
    currentStoryId && dispatch(fetchStory(currentStoryId));
  }, [dispatch, currentStoryId]);

  // set globe to sphere projection
  useEffect(() => {
    dispatch(setGlobeProjectionAction(sphereProjection, 0));
  }, [dispatch, sphereProjection]);

  // clean up story on unmount
  useEffect(
    () => () => {
      dispatch(setSelectedLayerIdsAction(null, true));
      dispatch(setSelectedLayerIdsAction(null, false));
      dispatch(setGlobeTimeAction(0));
    },
    [dispatch]
  );

  if (!mode) {
    return null;
  }

  const getVideoDuration = async (player: YouTubePlayer | VideoJsPlayer) => {
    if ((player as YouTubePlayer).getDuration) {
      const duration = await (player as YouTubePlayer).getDuration();
      setVideoDuration(duration * 1000);
    } else {
      const duration = (player as VideoJsPlayer).duration;
      setVideoDuration(Number(duration) * 1000);
    }
  };

  const getRightSideComponent = (slide: Slide, story: StoryType) => {
    if (slide.type === SlideType.Image && slide.images) {
      return (
        <StoryGallery
          mode={mode}
          images={slide.images}
          imageFits={slide.imageFits}
          imageCaptions={slide.imageCaptions}
          storyId={story.id}
        />
      );
    } else if (
      slide.type === SlideType.Video &&
      (slide.videoSrc || slide.videoId)
    ) {
      return (
        <StoryVideo
          mode={mode}
          storyId={story.id}
          slide={slide}
          onPlay={(player: YouTubePlayer | VideoJsPlayer) =>
            getVideoDuration(player)
          }
        />
      );
    }

    return (
      <div className={styles.globeContainer}>
        <DataViewer
          hideNavigation
          markers={slide.markers}
          backgroundColor={'#000000'}
        />
        <div className={styles.layerDetails}>
          <TimeSlider noTimeClamp className={styles.storySlider} />
          {slide.layerDescription && (
            <LayerDescription layerDescription={slide.layerDescription} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.story}>
      {storyListItem && (
        <Header
          backLink={`/${mode.toString()}`}
          backButtonId="backToStories"
          title={isSplashScreen ? '' : storyListItem.title}>
          {storyMode ? <Share /> : undefined}
        </Header>
      )}
      <main className={styles.main}>
        {/* Instead of rendering only the currect slide we map over all slides to
        enforce a newly mounted component when the slideNumber changes */}
        {selectedStory?.slides.map(
          (currentSlide, index) =>
            index === slideIndex &&
            (currentSlide.type === SlideType.Splashscreen ? (
              <SplashScreen
                mode={mode}
                key={index}
                storyId={selectedStory.id}
                slide={currentSlide}
              />
            ) : (
              <React.Fragment key={index}>
                <StoryContent
                  mode={mode}
                  storyId={selectedStory.id}
                  slide={currentSlide}
                />
                {getRightSideComponent(currentSlide, selectedStory)}
              </React.Fragment>
            ))
        )}
      </main>
      <StoryFooter
        videoDuration={videoDuration}
        mode={mode}
        slideIndex={slideIndex}
        selectedStory={selectedStory}
      />
    </div>
  );
};

export default Story;
