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
import { DATA_NO_SNAP_ATTR } from "../../../../../../../../hooks/use-lenis-for-story";

export type AnimationDirection = "vertical" | "horizontal";

interface BlendImageProps {
  active: boolean;
  animationDirection: AnimationDirection;
  image: ImageModuleSlide;
  numSlides: number;
  prevFlag: string | undefined;
  ref: Ref<HTMLDivElement> | undefined;
  scrollYProgress: MotionValue<number>;
  slideIndex: number;
  storyId: string;
}

export const TimeAndWavelengthBlendImage: FunctionComponent<
  BlendImageProps
> = ({
  active,
  animationDirection,
  image: { url, altText, focus, flag, caption },
  numSlides,
  prevFlag,
  ref,
  scrollYProgress,
  slideIndex,
  storyId,
}) => {
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
      : `inset(0 0 0 ${v}%)`,
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
          left: borderPosition,
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

  const flags = [flag || "", prevFlag || ""];

  return (
    <li className={styles.blendItem}>
      {/* This element is used to help the intersection observer keep track of which image is currently visible.
          The image itself cannot be used because it will always be fully in view */}
      <span
        /* We add the data-no-snap attribute here because we want the user to have full control of the "slider" */
        {...{ [DATA_NO_SNAP_ATTR]: true }}
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
        alt={`Slide ${slideIndex + 1}, ${altText || caption || ""} `}
        className={cx(styles.blendImage, focus)}
      />
      {isVisible && (
        <>
          <motion.div
            className={cx(
              styles.blendBorder,
              animationDirection === "horizontal" && styles.horizontal,
            )}
            style={borderStyle}
            aria-hidden="true"
          />
          {animationDirection === "horizontal" &&
            flags.map((flag, index) => (
              <motion.span
                key={index}
                style={{ left: borderPosition }}
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
