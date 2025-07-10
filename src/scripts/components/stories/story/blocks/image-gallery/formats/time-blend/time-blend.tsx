import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { FormatParallexLayout } from "../../../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../../../types/story";
import { useStory } from "../../../../../../../providers/story/use-story";
import { getStoryAssetUrl } from "../../../../../../../libs/get-story-asset-urls";
import { useSwipeVertical } from "../../../../../../../hooks/use-swipe-vertical";

import styles from "./time-blend.module.css";

const TimeBlend: FunctionComponent<StorySectionProps> = ({ slideIndex }) => {
  const { story, storyElement } = useStory();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const content = story?.content?.[0]?.blocks?.[slideIndex - 1];
  const slides = useMemo(() => content?.slides ?? [], [content]);

  const isAtStart = currentImageIndex === 0;
  const isAtEnd = currentImageIndex === slides.length - 1;

  // Effect to control the scroll behavior of the main story container.
  // It allows normal page scrolling only when the gallery is at the first or last image.
  useEffect(() => {
    if (!storyElement) return;
    storyElement.style.overflowY = isAtStart || isAtEnd ? "scroll" : "hidden";
  }, [storyElement, isAtStart, isAtEnd]);

  const swipeHandlers = useSwipeVertical({
    onSwipeUp: () => {
      if (!isAtEnd) {
        setCurrentImageIndex((prev) => prev + 1);
      }
    },
    onSwipeDown: () => {
      if (!isAtStart) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    },
    // The "Started" handlers provide immediate feedback on scroll-locking
    // at the exact moment a swipe begins, overriding the useEffect's state.
    onSwipeUpStarted: () => {
      if (!storyElement) return;
      // If at the end and swiping up, unlock to scroll to the next story block.
      // Otherwise, ensure it's locked.
      storyElement.style.overflowY = isAtEnd ? "scroll" : "hidden";
    },
    onSwipeDownStarted: () => {
      if (!storyElement) return;
      // If at the end and swiping down, lock scroll to re-enter the gallery view.
      if (isAtEnd) {
        storyElement.style.overflowY = "hidden";
      }
    },
  });

  const imageSlides = useMemo(
    () =>
      slides.map((slide, i) => (
        <img
          src={getStoryAssetUrl(story.id, slide.url)}
          alt={`Slide ${i + 1}`}
          key={i}
          className={styles.timeImageBlend}
          style={{
            zIndex: i,
            transform: `translateX(${currentImageIndex >= i ? 0 : 100}%)`,
          }}
        />
      )),
    [slides, story?.id, currentImageIndex],
  );

  if (!story || !content) {
    return null;
  }

  return (
    <FormatParallexLayout
      {...swipeHandlers}
      className={styles.timeBlendContent}
      index={slideIndex}
    >
      {imageSlides}
    </FormatParallexLayout>
  );
};

export default TimeBlend;
