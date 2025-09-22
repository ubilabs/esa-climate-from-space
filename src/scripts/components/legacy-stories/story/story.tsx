import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VideoJsPlayer } from "video.js";
import { YouTubePlayer } from "youtube-player/dist/types";

import { useContentParams } from "../../../hooks/use-content-params";
import { setGlobeTime } from "../../../reducers/globe/time";
import SplashScreen from "../splash-screen/splash-screen";
import StoryContent from "../story-content/story-content";
import StoryFooter from "../story-footer/story-footer";
import StoryGallery from "../story-gallery/story-gallery";
import StoryGlobe from "../story-globe/story-globe";
import StoryImage from "../story-image/story-image";
import StoryVideo from "../story-video/story-video";
import Header from "../../main/header/header";

import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { GalleryItemType } from "../../../types/gallery-item";
import { GlobeProjection } from "../../../types/globe-projection";
import { Slide, LegacyStory as StoryType } from "../../../types/story";

import StoryEmbedded from "../story-embedded/story-embedded";

import { setFlyTo } from "../../../reducers/fly-to";
import { setGlobeProjection } from "../../../reducers/globe/projection";
import { setSelectedLayerIds } from "../../../reducers/layers";
import { useGetStoryListQuery, useGetLegacyStoryQuery } from "../../../services/api";
import { appRouteSelector } from "../../../selectors/route-match";
import { languageSelector } from "../../../selectors/language";

import config from "../../../config/main";

import styles from "./story.module.css";

const Story: FunctionComponent = () => {
  const storyParams = useContentParams();
  const sphereProjection = GlobeProjection.Sphere;
  const dispatch = useThunkDispatch();
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const { slideIndex, currentStoryId } = storyParams;
  const contentRef = useRef<HTMLDivElement>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const appRoute = useSelector(appRouteSelector);

  const lang = useSelector(languageSelector);

  useGetStoryListQuery(lang);

  const { data: selectedStory } = useGetLegacyStoryQuery({
    id: currentStoryId,
    language: lang,
  });

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
  useEffect(() => {
    return () => {
      const defaultView = config.globe.view;
      dispatch(
        setSelectedLayerIds({
          layerId: null,
          isPrimary: true,
        }),
      );
      dispatch(setFlyTo(defaultView));
      dispatch(
        setSelectedLayerIds({
          layerId: null,
          isPrimary: false,
        }),
      );
      dispatch(setGlobeTime(0));
    };
  }, [dispatch]);

  // Scroll to top of page when slide index changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [slideIndex]);

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
        <StoryGallery
          storyId={story.id}
          key={story.id}
          showLightbox={showLightbox}
          setShowLightbox={setShowLightbox}
        >
          {slide.galleryItems.map((item) => {
            switch (item.type) {
              case GalleryItemType.Image:
                return (
                  <StoryImage
                    storyId={story.id}
                    imageItem={item}
                    showLightbox={showLightbox}
                  />
                );
              case GalleryItemType.Video:
                return item.videoSrc || item.videoId ? (
                  <StoryVideo
                    route={appRoute}
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
                return (
                  <StoryEmbedded
                    embeddedItem={item}
                    showLightbox={showLightbox}
                  />
                );
              default:
                console.warn(
                  `Unknown gallery item type ${item["type"]} on slide ${slideIndex + 1
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
    <>
      <Header />
      <div className={styles.story}>
        <main className={styles.main} ref={contentRef}>
          {/* Instead of rendering only the current slide we map over all slides to
        enforce a newly mounted component when the slideNumber changes */}
          {selectedStory?.slides.map(
            (currentSlide, index) =>
              index === slideIndex &&
              (currentSlide.splashImage ? (
                <SplashScreen
                  key={index}
                  storyId={selectedStory.id}
                  slide={currentSlide}
                />
              ) : (
                <React.Fragment key={index}>
                  <StoryContent
                    route={appRoute}
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
          slideIndex={slideIndex}
          selectedStory={selectedStory ? selectedStory : null}
        />
      </div>
    </>
  );
};

export default Story;
