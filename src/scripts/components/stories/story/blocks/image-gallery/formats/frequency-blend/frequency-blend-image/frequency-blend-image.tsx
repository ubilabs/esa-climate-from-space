import { FunctionComponent } from "react";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { ImageSlide } from "../../../../../../../../types/story";

import { motion, useTransform, MotionValue } from "motion/react";

import styles from "./frequecy-blend-image.module.css"


interface FrequencyBlendImageProps {
  scrollYProgress: MotionValue<number>;
  slideIndex: number;
  numSlides: number;
  storyId: string;
  image: ImageSlide;
}

export const FrequencyBlendImage: FunctionComponent<FrequencyBlendImageProps> = ({
  scrollYProgress,
  slideIndex,
  numSlides,
  storyId,
  image: { url, altText },
}) => {
  const isFirstSlide = slideIndex === 0;

  // Calculate the vertical translation based on scroll progress and slide index.
  // For the first slide, there's no movement (static at "0vh").
  // For other slides, the translation animates from "100vh" to "0vh" as the user scrolls.
  const translateY = useTransform(
    scrollYProgress,
    isFirstSlide
      ? [0, 1]
      : [(slideIndex - 1) / (numSlides - 1), slideIndex / (numSlides - 1)],
    isFirstSlide ? ["0vh", "0vh"] : ["100vh", "0vh"],
  );

  return (
    <motion.li style={{ translateY: translateY }}>
      <img
        src={getStoryAssetUrl(storyId, url)}
        alt={`Slide ${slideIndex + 1}, ${altText}`}
        className={styles.frequencyImageBlend}
      />
    </motion.li>
  );
};
