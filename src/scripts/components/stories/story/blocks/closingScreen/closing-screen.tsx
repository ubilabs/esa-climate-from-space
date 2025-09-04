import { FunctionComponent, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { motion, useTransform } from "motion/react";

import config from "../../../../../config/main";

import { setFlyTo } from "../../../../../reducers/fly-to";

import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";
import { isLocationStory } from "../../../../../libs/is-location-story";

import { useStoryScroll } from "../../../../../hooks/use-story-scroll";
import { useStory } from "../../../../../providers/story/use-story";

import { StorySectionProps } from "../../../../../types/story";

import { SlideContainer } from "../../../layout/slide-container/slide-container";

import { STORY_LATITUDE_OFFSET } from "../../../../../config/main";

import cx from "classnames";

import styles from "./splashscreen.module.css";
import { Caption } from "../generic/text-overlay/text-overlay-slide/text-overlay-slide";

export const SplashScreen: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { story, storyElementRef } = useStory();
  const targetRef = useRef<HTMLDivElement>(null);
  storyElementRef.current?.classList.toggle(styles.islocationbased);

  const { scrollYProgress } = useStoryScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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
  console.log("splashscreen slides:", slides);

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
              caption={slide.description}
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
