import { useRef, useState, useMemo, FunctionComponent } from "react";
import { useMotionValueEvent } from "motion/react";
import {
  ImageModuleSlide,
  StorySectionProps,
} from "../../../../../../../../types/story";

import { AnimationDirection, TimeAndWavelengthBlendImage } from "../time-and-wavelength-blend-image/time-and-wavelength-blend-image";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";
import { useModuleContent } from "../../../../../../../../providers/story/module-content/use-module-content";

import styles from "./time-and-wavelength-blend.module.css";

interface BlendWrapperProps extends StorySectionProps {
  animationDirection: AnimationDirection;
}

const TimeAndWavelengthBlend: FunctionComponent<BlendWrapperProps> = ({
  animationDirection,
}) => {
  const { module, storyId , getRefCallback} = useModuleContent();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const images: ImageModuleSlide[] = useMemo(() => module?.slides ?? [], [module]);
  const numSlides = images.length;
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

  const { scrollYProgress } = useStoryScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveSlideIndex(
      Math.min(Math.round(latest * numSlides), numSlides - 1),
    );
  });

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
      <div className={styles.stickyScroller}>
        <ul className={styles.imageContainer}>
          {images.map((image, i) => (
            <TimeAndWavelengthBlendImage
              key={`${storyId}-${i}`}
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
      </div>
    </div>
  );
};

export default TimeAndWavelengthBlend;
