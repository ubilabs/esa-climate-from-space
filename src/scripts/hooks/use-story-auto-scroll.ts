import { useCallback, useEffect } from "react";
import { useStory } from "../providers/story/use-story";
import { extractSlideIndex } from "../libs/content-url-parameter";
import { getHashPathName } from "../libs/get-hash-path";
import { SLIDE_INDEX_ATTRIBUTE } from "../config/main";

export function useStoryAutoScroll() {
  const { storyElement, hasInitialScrolled } = useStory();

  const scrollToSlideIndex = useCallback(
    (index: number) => {
      if (!storyElement) return;

      const targetElement = Array.from(
        document.querySelectorAll(`[${SLIDE_INDEX_ATTRIBUTE}]`),
      ).find((el) => el.getAttribute(SLIDE_INDEX_ATTRIBUTE) === index.toString());

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    },
    [storyElement],
  );

  // Scroll on initial mount
  useEffect(() => {
    if (!storyElement || hasInitialScrolled.current) return;

    // Ideally, we would use the "scrollEnd" event here, but it is not supported in Safari as of now
    // However, setting the event listener only once achieves a similar result
    storyElement.addEventListener(
      "scroll",
      () => {
        hasInitialScrolled.current = true;
      },
      { once: true },
    );

    // Use timeout to let the initial fading animation finish
    setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToSlideIndex(extractSlideIndex(getHashPathName()));
      });
    }, 1000);
  }, [hasInitialScrolled, scrollToSlideIndex, storyElement]);

  return {
    isInitialScroll: hasInitialScrolled.current,
  };
}
