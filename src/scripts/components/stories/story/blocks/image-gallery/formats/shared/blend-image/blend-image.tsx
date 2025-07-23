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

  const percentageValue = useTransform(scrollYProgress, inputRange, [100, -2]);

  const clipPathValue = useTransform(percentageValue, (v) =>
    animationDirection === "vertical"
      ? `inset(${v}% 0 0 0)`
      : `inset(0 ${v}% 0 0)`,
  );

  const style = {
    clipPath: slideIndex === 0 ? "inset(0 0 0 0)" : clipPathValue,
    zIndex: slideIndex,
  };

  const borderPosition = useTransform(percentageValue, (v) => `${v}%`);

  const borderThickness = "2px";

  const borderStyle =
    animationDirection === "vertical"
      ? {
          top: borderPosition,
          left: 0,
          width: "100%",
          height: borderThickness,
        }
      : {
          top: 0,
          right: borderPosition,
          width: borderThickness,
          height: "100%",
        };

  return (
    <motion.li style={style} className={styles.blendItem}>
      <img
        src={getStoryAssetUrl(storyId, url)}
        alt={`Slide ${slideIndex + 1}, ${altText}`}
        className={styles.blendImage}
      />
      {slideIndex !== 0 && (
        <motion.div
          className={styles.blendBorder}
          style={borderStyle}
          aria-hidden="true"
        />
      )}
    </motion.li>
  );
};
