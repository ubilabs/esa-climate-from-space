import { FunctionComponent, Ref, useState } from "react";
import {
  motion,
  useTransform,
  MotionValue,
  useMotionValueEvent,
} from "motion/react";

import { getStoryAssetUrl } from "../../../../../../../../libs/get-story-asset-urls";
import { ImageModuleSlide } from "../../../../../../../../types/story";

import cx from "classnames";

import styles from "./time-and-wavelength-blend-image.module.css";

export type AnimationDirection = "vertical" | "horizontal";

interface BlendImageProps {
  active: boolean;
  animationDirection: AnimationDirection;
  image: ImageModuleSlide;
  numSlides: number;
  prevCaption: string | undefined;
  ref: Ref<HTMLDivElement> | undefined;
  scrollYProgress: MotionValue<number>;
  slideIndex: number;
  storyId: string;
}

export const TimeAndWavelengthBlendImage: FunctionComponent<BlendImageProps> = ({
  active,
  animationDirection,
  image: { url, altText, captions },
  numSlides,
  prevCaption,
  ref,
  scrollYProgress,
  slideIndex,
  storyId,
}) => {
  const caption = captions?.join();
  const inputRange =
    numSlides === 1
      ? [0, 1]
      : [(slideIndex - 1) / (numSlides - 1), slideIndex / (numSlides - 1)];

  const percentageValue = useTransform(scrollYProgress, inputRange, [100, 0]);
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(percentageValue, "change", (latest) => {
    setIsVisible(latest > 0 && latest < 100);
  });

  const clipPathValue = useTransform(percentageValue, (v) =>
    animationDirection === "vertical"
      ? `inset(${v}% 0 0 0)`
      : `inset(0 ${v}% 0 0)`,
  );

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

  const style = {
    clipPath: slideIndex === 0 ? "inset(0 0 0 0)" : clipPathValue,
    zIndex: slideIndex,
  };

  const sentinelStyle = {
    scrollMarginTop:
      slideIndex === 0 ? "0px" : "calc(var(--story-height) * -1 + 1px)",
  };

  const flags = [prevCaption || "", caption || ""];

  return (
    <li className={styles.blendItem}>
      {/* This element is used to help the intersection observer keep track of which image is currently visible.
          The image itself cannot be used because it will always be fully in view */}
      <span
        aria-hidden="true"
        ref={ref}
        style={sentinelStyle}
        className={cx(styles.sentinelElement, active && styles.inView)}
      >
        {slideIndex}
      </span>
      <motion.img
        style={style}
        src={getStoryAssetUrl(storyId, url)}
        alt={`Slide ${slideIndex + 1}, ${altText}`}
        className={styles.blendImage}
      />
      {isVisible && (
        <>
          <motion.div
            className={styles.blendBorder}
            style={borderStyle}
            aria-hidden="true"
          />
          {animationDirection === "horizontal" &&
            flags.map((flag) => (
              <motion.span
                key={flag}
                style={{ right: borderPosition }}
                className={styles.flag}
              >
                {flag}
              </motion.span>
            ))}
        </>
      )}
    </li>
  );
};

