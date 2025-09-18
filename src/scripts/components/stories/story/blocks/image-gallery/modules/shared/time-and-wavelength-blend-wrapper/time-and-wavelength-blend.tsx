import { useRef, useState, useMemo, FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import { motion, useMotionValueEvent } from "motion/react";
import { useGesture } from "@use-gesture/react";
import {
  ImageModuleSlide,
  StorySectionProps,
} from "../../../../../../../../types/story";

import {
  AnimationDirection,
  TimeAndWavelengthBlendImage,
} from "../time-and-wavelength-blend-image/time-and-wavelength-blend-image";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";
import { useStory } from "../../../../../../../../providers/story/use-story";
import { useScreenSize } from "../../../../../../../../hooks/use-screen-size";

import config from "../../../../../../../../config/main";

import cx from "classnames";

import styles from "./time-and-wavelength-blend.module.css";

const SENSITIVITY_FACTOR = 2.5;

interface BlendWrapperProps extends StorySectionProps {
  animationDirection: AnimationDirection;
}

const TimeAndWavelengthBlend: FunctionComponent<BlendWrapperProps> = ({
  animationDirection,
}) => {
  const { module, storyId, getRefCallback } = useModuleContent();
  const { lenisRef } = useStory();
  const { isTouchDevice, isMobile } = useScreenSize();

  const targetRef = useRef<HTMLDivElement | null>(null);
  const images: ImageModuleSlide[] = useMemo(
    () => module?.slides ?? [],
    [module],
  );
  const numSlides = images.length;

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const { scrollYProgress } = useStoryScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveSlideIndex(
      Math.min(Math.round(latest * (numSlides - 1)), numSlides - 1),
    );
  });

  // Manually scroll on horizontal drag
  // This will cause a warning in development about adding touch-action: none to the target element.
  // However, we cannot do that because the element wouldn't be scrollable.
  useGesture(
    {
      onDrag: ({ movement: [mx], first, memo }) => {
        if (!lenisRef.current) return memo;
        if (first || !mx) {
          memo = lenisRef.current.scroll;
        }
        const newScrollTop = memo - mx * SENSITIVITY_FACTOR;
        lenisRef.current.scrollTo(newScrollTop, { immediate: true });
        return memo;
      },
    },
    {
      target: targetRef,
      eventOptions: { passive: true },
      drag: {
        preventDefault: true,
        axis: "x",
        filterTaps: true,
        enabled: isTouchDevice && isMobile,
      },
    },
  );

  const caption = useMemo(() => {
    const activeSlide = images[activeSlideIndex];
    if (!activeSlide) return "";
    return activeSlide.caption || "";
  }, [activeSlideIndex, images]);

  return (
    <div
      ref={targetRef}
      className={styles.stickySectionWrapper}
      style={{ height: `calc(${numSlides} * var(--story-height))` }}
    >
      <motion.div className={styles.stickyScroller}>
        <ul className={styles.imageContainer}>
          {images.map((image, i) => (
            <TimeAndWavelengthBlendImage
              prevFlag={images[i - 1]?.flag}
              key={`${storyId}-${image.url}_${i}`}
              ref={getRefCallback?.(i, 0)}
              active={activeSlideIndex === i}
              slideIndex={i}
              scrollYProgress={scrollYProgress}
              numSlides={numSlides}
              storyId={storyId}
              image={image}
              animationDirection={animationDirection}
            />
          ))}
        </ul>
        <div className={cx(styles.currentImageText, "story-grid")}>
          <div className={styles.slideAndText}>
            <div className={styles.slideIndicator}>
              {activeSlideIndex + 1}/{numSlides}
            </div>
            <ReactMarkdown
              children={caption}
              allowedElements={config.markdownAllowedElements}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeAndWavelengthBlend;
