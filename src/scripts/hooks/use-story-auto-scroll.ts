import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { extractSlideIndex } from "../libs/content-url-parameter";

export function useStoryAutoScroll(storyElement: Element | null) {
  const location = useLocation();
  const initialSlideIndex = useMemo(
    () => extractSlideIndex(location.pathname),
    [location.pathname],
  );

  // Prevent initial scroll from triggering URL update
  const isInitialScroll = useRef(initialSlideIndex > 0);

  const scrollToSlideIndex = useCallback(
    (index: number) => {
      if (!storyElement) return;

      const targetElement = Array.from(
        document.querySelectorAll("[data-index]"),
      ).find((el) => el.getAttribute("data-index") === index.toString());

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
    if (!storyElement || !isInitialScroll.current) return;

    // Ideally, we would use the "scrollEnd" event here, but it is not supported in Safari as of now
    // However, setting the event listener only once achieves a similar result
    storyElement.addEventListener(
      "scroll",
      () => {
        isInitialScroll.current = false;
      },
      { once: true },
    );

    // Use timeout to let the initial fading animation finish
    setTimeout(() => {
      requestAnimationFrame(() => {
        scrollToSlideIndex(initialSlideIndex);
      });
    }, 1000);
  }, [initialSlideIndex, scrollToSlideIndex, storyElement]);

  return {
    isInitialScroll: isInitialScroll.current,
  };
}
