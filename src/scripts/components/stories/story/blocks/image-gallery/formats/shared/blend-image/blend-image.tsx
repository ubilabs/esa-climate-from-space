import { FunctionComponent } from "react";
import { motion, useTransform, MotionValue } from "motion/react";
import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { ImageSlide } from "../../../../../../../../types/story";
import styles from "./blend-image.module.css";

export type AnimationDirection = "vertical" | "horizontal";

interface BlendImageProps {
  scrollYProgress: MotionValue<number>;
  slideIndex: number;
  numSlides: number;
  storyId: string;
  image: ImageSlide;
  animationDirection: AnimationDirection;
}

export const BlendImage: FunctionComponent<BlendImageProps> = ({
  scrollYProgress,
  slideIndex,
  numSlides,
  storyId,
  image: { url, altText },
  animationDirection,
}) => {
  const inputRange =
    numSlides === 1
      ? [0, 1] // Fallback range when there's only one slide
      : [
          (slideIndex - 1) / (numSlides - 1),
          slideIndex / (numSlides - 1),
        ];

  // output range depends on the animation direction
  // For the first slide, we want to keep it at the top
  const outputRange =
    slideIndex === 0
      ? animationDirection === "vertical"
        ? ["0vh", "0vh"]
        : ["0vw", "0vw"]
      : animationDirection === "vertical"
        ? ["100vh", "0vh"]
        : ["100vw", "0vw"];

  const transformValue = useTransform(scrollYProgress, inputRange, outputRange);

  const style =
    animationDirection === "vertical"
      ? { translateY: transformValue }
      : { translateX: transformValue };

  return (
    <motion.li style={style}>
      <img
        src={getStoryAssetUrl(storyId, url)}
        alt={`Slide ${slideIndex + 1}, ${altText}`}
        className={styles.blendImage}
      />
    </motion.li>
  );
};
