import { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { motion, useTransform } from "motion/react";

import { setFlyTo } from "../../../../../reducers/fly-to";

import { getStoryAssetUrl } from "../../../../../libs/get-story-asset-urls";
import { isLocationStory } from "../../../../../libs/is-location-story";
import { splitText } from "../../../../../libs/split-text";

import { useStoryScroll } from "../../../../../hooks/use-story-scroll";

import { useStory } from "../../../../../providers/story/use-story";

import { TextContainer } from "../generic/text-overlay/text-overlay-slide/text-overlay-slide";
import { StorySectionProps } from "../../../../../types/story";

import { SlideContainer } from "../../../layout/slide-container/slide-container";

import { STORY_LATITUDE_OFFSET } from "../../../../../config/main";

import cx from "classnames";

import styles from "./splashscreen.module.css";

export const SplashScreen: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { story } = useStory();
  const targetRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const { scrollYProgress } = useStoryScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

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

  const {
    url,
    slides = [],
    title,
    subtitle,
    focus,
  } = story?.splashscreen || {};

  // Count total captions by splitting each slide's text
  const totalCaptions = slides.reduce((acc, slide) => {
    const textChunks = splitText(slide.text);
    return acc + textChunks.length;
  }, 0);

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1 / (totalCaptions + 1)],
    [0, 0.5],
  );

  // Convert plain strings into markdown heading strings
  const titleMarkdown = `# ${title} \n ${subtitle}`;

  if (!story) {
    return null;
  }

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
          // plus one to account for the intro slide
          height: `calc(${totalCaptions + 1} * var(--story-height))`,
        }}
        ref={targetRef}
        className={styles.splashBanner}
      >
        {/* needs to be placed outside of the content container, will other interfere with the transition calculation of framer */}
        <div
          className={cx(styles.parallaxContainer, focus)}
          style={{
            backgroundImage: `${!isLocationBased ? `url(${getStoryAssetUrl(id, url)})` : "none"}`,
          }}
        />
        <motion.div
          className={styles.backgroundOverlay}
          style={{ opacity: overlayOpacity }}
        />
        <div className={styles.contentContainer}>
          <TextContainer
            caption={titleMarkdown || ""}
            className={styles.storyIntro}
          />
          {slides.flatMap((slide, i) => {
            const textChunks = splitText(slide.text);
            return textChunks.map((chunk, chunkIndex) => (
              <TextContainer
                caption={chunk}
                key={`${i}-${chunkIndex}`}
                index={i * 1000 + chunkIndex}
              />
            ));
          })}
        </div>
      </div>
    </SlideContainer>
  );
};
