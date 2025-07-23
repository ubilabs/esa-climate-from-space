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
      ? [0, 1]
      : [(slideIndex - 1) / (numSlides - 1), slideIndex / (numSlides - 1)];

  const outputRange =
    animationDirection === "vertical"
      ? ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
      : ["inset(0 100% 0 0)", "inset(0 0% 0 0)"];

  const clipPathValue = useTransform(scrollYProgress, inputRange, outputRange);

  const style = {
    clipPath: slideIndex === 0 ? "inset(0 0 0% 0)" : clipPathValue,
    zIndex: slideIndex,
  };

  return (
    <motion.li style={style} className={styles.blendItem}>
      <img
        src={getStoryAssetUrl(storyId, url)}
        alt={`Slide ${slideIndex + 1}, ${altText}`}
        className={styles.blendImage}
      />
    </motion.li>
  );
};
