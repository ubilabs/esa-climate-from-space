import { FunctionComponent, useRef, useState, useEffect, useMemo } from "react";
import { TimeBlendImage } from "./time-blend-image/time-blend-image";

import { FormatContainer } from "../../../../../layout/format-container/format-container";

import { useFormat } from "../../../../../../../providers/story/format/use-format";
import { useStoryScroll } from "../../../../../../../hooks/use-story-scroll";

import styles from "./time-blend.module.css";

import {
  ImageSlide,
  StorySectionProps,
} from "../../../../../../../types/story";

const TimeBlend: FunctionComponent<StorySectionProps> = ({ ref }) => {
  const { content, storyId } = useFormat();

  const targetRef = useRef<HTMLDivElement | null>(null);

  const images: ImageSlide[] = useMemo(() => content?.slides ?? [], [content]);
  const numSlides = images.length;

  const { scrollYProgress } = useStoryScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const [description, setDescription] = useState(images[0]?.altText ?? "");

  const [caption, setCaption] = useState(images[0]?.caption ?? "");

  // Update description and caption when scroll position changes
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const activeSlideIndex = Math.round(latest * numSlides);
      const activeSlide = images[activeSlideIndex];
      if (activeSlide && activeSlide.altText !== description) {
        setDescription(activeSlide.altText ?? "");
        setCaption(activeSlide.caption ?? "");
      }
    });
  }, [scrollYProgress, images, numSlides, description]);

  if (!content || numSlides === 0) {
    return null;
  }

  return (
    <FormatContainer ref={ref} className={styles.timeBlend}>
      <div
        ref={targetRef}
        className={styles.stickySectionWrapper}
        style={{ height: `${numSlides * 100}dvh` }}
      >
        <div className={styles.stickyScroller}>
          <ul className={styles.imageContainer}>
            {images.map((image, i) => (
              <TimeBlendImage
                key={i}
                slideIndex={i}
                scrollYProgress={scrollYProgress}
                numSlides={numSlides}
                storyId={storyId}
                image={image}
              />
            ))}
          </ul>
          <div className={styles.altText}>
            <h3>{caption}</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </FormatContainer>
  );
};

export default TimeBlend;
