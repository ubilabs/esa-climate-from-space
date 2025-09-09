import { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { setFlyTo } from "../../../../../reducers/fly-to";

import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";
import { isLocationStory } from "../../../../../libs/is-location-story";

import { useStory } from "../../../../../providers/story/use-story";

import { Caption } from "../generic/text-overlay/text-overlay-slide/text-overlay-slide";
import { StorySectionProps } from "../../../../../types/story";

import { SlideContainer } from "../../../layout/slide-container/slide-container";

import { STORY_LATITUDE_OFFSET } from "../../../../../config/main";

import cx from "classnames";

import styles from "./splashscreen.module.css";

export const SplashScreen: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { story } = useStory();
  const targetRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const isLocationBased = isLocationStory(story);
  const location = story?.splashscreen?.location;

  // We apply the flyTo with a delay. This is a visual effect to make sure the globe container is centered
  useEffect(() => {
    if (isLocationBased) {
      // Get location
      setTimeout(() => {
        dispatch(
          setFlyTo({
            ...location,
            // We offset center because otherwise it would overlap with the text (which is also centered)
            lat: (location?.lat as number) + STORY_LATITUDE_OFFSET,
            isAnimated: true,
          }),
        );
      }, 1000);
    }
  }, [isLocationBased, dispatch, location]);

  if (!story || !story.splashscreen) {
    return null;
  }

  const { image, slides } = story.splashscreen;

  const { id } = story;

  return (
    <SlideContainer
      className={cx(
        styles.splashscreenContainer,
        isLocationBased && styles.locationStory,
      )}
      ref={ref}
    >
      <div
        style={{
          height: `calc(${slides.length} * var(--story-height))`,
        }}
        ref={targetRef}
        className={styles.splashBanner}
      >
        {/* needs to be placed outside of the content container, will other interfere with the transition calculation of framer */}
        <div
          className={styles.parallaxContainer}
          style={{
            backgroundImage: `${!isLocationBased ? `url(${getStoryAssetUrl(id, image)})` : "none"}`,
          }}
        />
        <div className={styles.contentContainer}>
          {slides.map((slide, i) => (
            <Caption
              caption={slide.text}
              key={i}
              index={i}
              className={(i === 0 && styles.storyIntro) || ""}
            />
          ))}
        </div>
      </div>
    </SlideContainer>
  );
};
