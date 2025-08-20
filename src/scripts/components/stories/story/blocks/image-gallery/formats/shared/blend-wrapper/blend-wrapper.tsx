import { useRef, useState, useEffect, useMemo, FunctionComponent } from "react";
import { BlendImage, AnimationDirection } from "../blend-image/blend-image";
import styles from "./blend-wrapper.module.css";
import { FormatContainer } from "../../../../../../layout/format-container/format-container";
import {
  ImageSlide,
  StorySectionProps,
} from "../../../../../../../../types/story";
import { useFormat } from "../../../../../../../../providers/story/format/use-format";
import { useStoryScroll } from "../../../../../../../../hooks/use-story-scroll";

interface BlendWrapperProps extends StorySectionProps {
  animationDirection: AnimationDirection;
}

const BlendWrapper: FunctionComponent<BlendWrapperProps> = ({
  animationDirection,
  ref,
}) => {
  const { content, storyId } = useFormat();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const images: ImageSlide[] = useMemo(() => content?.slides ?? [], [content]);
  const numSlides = images.length;

  const { scrollYProgress } = useStoryScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const [description, setDescription] = useState(images[0]?.altText ?? "");
  const [captions, setCaptions] = useState<Array<string>>(
    images[0]?.captions ?? [],
  );

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const activeSlideIndex = Math.round(latest * numSlides);
      const activeSlide = images[activeSlideIndex];
      if (activeSlide && activeSlide.altText !== description) {
        setDescription(activeSlide.altText ?? "");
        setCaptions(activeSlide.captions ?? []);
      }
    });
  }, [scrollYProgress, images, numSlides, description]);

  if (!content || numSlides === 0) {
    return null;
  }

  return (
    <FormatContainer ref={ref}>
      <div
        ref={targetRef}
        className={styles.stickySectionWrapper}
        style={{ height: `${numSlides * 100}dvh` }}
      >
        <div className={styles.stickyScroller}>
          <ul className={styles.imageContainer}>
            {images.map((image, i) => (
              <BlendImage
                key={i}
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
    </FormatContainer>
  );
};

export default BlendWrapper;
