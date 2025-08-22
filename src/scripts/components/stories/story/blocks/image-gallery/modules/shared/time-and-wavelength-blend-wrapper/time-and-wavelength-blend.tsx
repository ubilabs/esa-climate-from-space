import { useRef, useState, useMemo, FunctionComponent } from "react";
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

import styles from "./time-and-wavelength-blend.module.css";

const SENSITIVITY_FACTOR = 2.5;

interface BlendWrapperProps extends StorySectionProps {
  animationDirection: AnimationDirection;
}

const TimeAndWavelengthBlend: FunctionComponent<BlendWrapperProps> = ({
  animationDirection,
}) => {
  const { module, storyId, getRefCallback } = useModuleContent();
  const { storyElementRef } = useStory();
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
        if (!storyElementRef.current) return memo;
        if (first) {
          memo = storyElementRef.current.scrollTop;
        }
        const newScrollTop = memo + mx * SENSITIVITY_FACTOR;
        storyElementRef.current.scrollTop = newScrollTop;
        return memo;
      },
    },
    {
      target: targetRef,
      eventOptions: { passive: true },
      drag: {
        axis: "x",
        filterTaps: true,
        enabled: isTouchDevice && isMobile,
      },
    },
  );

  const description = useMemo(() => {
    const activeSlide = images[activeSlideIndex ?? 0];
    return activeSlide
      ? activeSlide.description
        ? activeSlide.description
        : activeSlide.altText
      : "";
  }, [activeSlideIndex, images]);

  const captions = useMemo(() => {
    const activeSlide = images[activeSlideIndex ?? 0];
    return activeSlide ? activeSlide.captions : [];
  }, [activeSlideIndex, images]);

  if (!module || numSlides === 0) {
    return null;
  }

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
              key={`${storyId}-${image.url}`}
              ref={getRefCallback?.(i)}
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
        <div className={styles.altText}>
          <h3>{captions.join(" ")}</h3>
          <p>{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeAndWavelengthBlend;
