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
import { FormatContainer } from "../../../layout/format-container/format-container";

import { STORY_LATITUDE_OFFSET } from "../../../../../config/main";

import cx from "classnames";

import styles from "./splashscreen.module.css";

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

  const { text, image } = story.splashscreen;

  const { id } = story;

  return (
    <FormatContainer
      className={cx(
        styles.splashscreen,
        isLocationBased && styles.locationStory,
      )}
      ref={ref}
    >
      <div ref={targetRef} className={styles.splashBanner}>
        <motion.div
          className={styles.parallaxContainer}
          style={{
            y: imageY,
            scale,
            backgroundImage: `${!isLocationBased ? `url(${getStoryAssetUrl(id, image)})` : "none"}`,
          }}
        />
        <motion.div style={{ opacity }} className={styles.contentContainer}>
          <ReactMarkdown
            className={styles.content}
            children={text}
            allowedElements={config.markdownAllowedElements}
          />
        </motion.div>
      </div>
    </FormatContainer>
  );
};
