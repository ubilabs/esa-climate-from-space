import React, { FunctionComponent, useEffect, useState } from "react";
import { YouTubePlayer } from "youtube-player/dist/types";
import { VideoJsPlayer } from "video.js";
import { useSelector } from "react-redux";

import { useStoryParams } from "../../../hooks/use-story-params";
import StoryImage from "../story-image/story-image";
import StoryGlobe from "../story-globe/story-globe";
import StoryContent from "../story-content/story-content";
import StoryGallery from "../story-gallery/story-gallery";
import StoryFooter from "../story-footer/story-footer";
import Header from "../header/header";
import StoryVideo from "../story-video/story-video";
import { setGlobeTime } from "../../../reducers/globe/time";
import Share from "../../main/share/share";
import SplashScreen from "../splash-screen/splash-screen";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import { GlobeProjection } from "../../../types/globe-projection";
import { StoryMode } from "../../../types/story-mode";
import { Slide, Story as StoryType } from "../../../types/story";
import { GalleryItemType } from "../../../types/gallery-item";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";

import StoryEmbedded from "../story-embedded/story-embedded";

import styles from "./story.module.css";
import { setGlobeProjection } from "../../../reducers/globe/projection";
import { setSelectedLayerIds } from "../../../reducers/layers";
import { storiesApi } from "../../../services/api";

const Story: FunctionComponent = () => {
  const storyParams = useStoryParams();
  const sphereProjection = GlobeProjection.Sphere;
  const dispatch = useThunkDispatch();
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const { mode, slideIndex, currentStoryId, selectedStory, storyListItem } =
    storyParams;
  const storyMode = mode === StoryMode.Stories;
  const isSplashScreen = Boolean(selectedStory?.slides[slideIndex].splashImage);
  const { story_header } = useSelector(embedElementsSelector);

  // fetch story of active storyId
  useEffect(() => {
    if (currentStoryId) {
      dispatch(
        storiesApi.endpoints.getStory.initiate({
          id: currentStoryId,
          language: "en",
        }),
      );
    }
  }, [dispatch, currentStoryId]);

  // set globe to sphere projection
  useEffect(() => {
    dispatch(
      setGlobeProjection({
        projection: sphereProjection,
        morphTime: 0,
      }),
    );
  }, [dispatch, sphereProjection]);

  // clean up story on unmount
  useEffect(
    () => () => {
      dispatch(
        setSelectedLayerIds({
          layerId: null,
          isPrimary: true,
        }),
      );
      dispatch(
        setSelectedLayerIds({
          layerId: null,
          isPrimary: false,
        }),
      );
      dispatch(setGlobeTime(0));
    },
    [dispatch],
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
    if (slide.galleryItems) {
      return (
        <StoryGallery mode={mode} storyId={story.id} key={story.id}>
          {slide.galleryItems.map((item) => {
            switch (item.type) {
              case GalleryItemType.Image:
                return <StoryImage storyId={story.id} imageItem={item} />;
              case GalleryItemType.Video:
                return item.videoSrc || item.videoId ? (
                  <StoryVideo
                    mode={mode}
                    storyId={story.id}
                    videoItem={item}
                    onPlay={(player: YouTubePlayer | VideoJsPlayer) =>
                      getVideoDuration(player)
                    }
                  />
                ) : (
                  <></>
                );
              case GalleryItemType.Globe:
                return <StoryGlobe globeItem={item} />;
              case GalleryItemType.Embedded:
                return <StoryEmbedded embeddedItem={item} />;
              default:
                console.warn(
                  `Unknown gallery item type ${item["type"]} on slide ${
                    slideIndex + 1
                  } in story ${story.id}`,
                );
                return <></>;
            }
          })}
        </StoryGallery>
      );
    }
    return null;
  };

  return (
    <div className={styles.story}>
      {storyListItem && story_header && (
        <Header
          backLink={`/${mode.toString()}`}
          backButtonId="backToStories"
          title={isSplashScreen ? "" : storyListItem.title}
        >
          {storyMode ? <Share /> : undefined}
        </Header>
      )}
      <main className={styles.main}>
        {/* Instead of rendering only the current slide we map over all slides to
        enforce a newly mounted component when the slideNumber changes */}
        {selectedStory?.slides.map(
          (currentSlide, index) =>
            index === slideIndex &&
            (currentSlide.splashImage ? (
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
            )),
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
