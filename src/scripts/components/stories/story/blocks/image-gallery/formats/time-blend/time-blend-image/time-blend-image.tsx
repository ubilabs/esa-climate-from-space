import { FunctionComponent } from "react";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { motion, useTransform, MotionValue } from "motion/react";

import styles from "./time-blend-image.module.css";
import { ImageSlide } from "../../../../../../../../types/story";

interface TimeBlendImageProps {
  scrollYProgress: MotionValue<number>;
  slideIndex: number;
  numSlides: number;
  storyId: string;
  image: ImageSlide;
}

export const TimeBlendImage: FunctionComponent<TimeBlendImageProps> = ({
  scrollYProgress,
  slideIndex,
  numSlides,
  storyId,
  image: { url, altText },
}) => {
  const isFirstSlide = slideIndex === 0;

  // Calculate the horizontal translation based on scroll progress and slide index.
  // For the first slide, there's no movement (static at "0vw").
  // For other slides, the translation animates from "100vw" to "0vw" as the user scrolls.
  const translateX = useTransform(
    scrollYProgress,
    isFirstSlide
      ? [0, 1]
      : [(slideIndex - 1) / (numSlides - 1), slideIndex / numSlides],
    isFirstSlide ? ["0vw", "0vw"] : ["100vw", "0vw"],
  );

  return (
    <motion.li style={{ translateX }}>
      <img
        src={getStoryAssetUrl(storyId, url)}
        alt={`Slide ${slideIndex + 1}, ${altText}`}
        className={styles.timeImageBlend}
      />
    </motion.li>
  );
};
