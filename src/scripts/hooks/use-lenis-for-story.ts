import { useEffect, useRef } from "react";
import { frame, cancelFrame } from "motion/react";

import Lenis from "lenis";

import { useStory } from "../providers/story/use-story";
import config from "../config/main";

export function useLenisForStory() {
  const { storyElementRef, story, lenisRef } = useStory();
  const previousScrollTopRef = useRef(0);
  const previousMaxScrollRef = useRef(0);

  // Any scrolling should be handled by lenis, so we disable the browser's native scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  // Initialize Lenis and integrate with Framer Motion's RAF loop
  useEffect(() => {
    if (!storyElementRef.current || !story) return;

    const wrapper = storyElementRef.current;

    const lenis = new Lenis({
      // important: bind Lenis to the storyElementRef
      wrapper: wrapper,
      ...config.lenisOptions,
    });

    lenisRef.current = lenis;

    // make sure scroll progress is preserved when user rotates or resizes window
    const updateScrollMetrics = () => {
      previousScrollTopRef.current = wrapper.scrollTop;
      previousMaxScrollRef.current = Math.max(
        wrapper.scrollHeight - wrapper.clientHeight,
        0,
      );
    };

    let resizeFrameId = 0;
    let settleFrameId = 0;

    const restoreScrollProgress = () => {
      cancelAnimationFrame(resizeFrameId);
      cancelAnimationFrame(settleFrameId);

      resizeFrameId = requestAnimationFrame(() => {
        settleFrameId = requestAnimationFrame(() => {
          const previousMaxScroll = previousMaxScrollRef.current;
          const progress =
            previousMaxScroll > 0
              ? previousScrollTopRef.current / previousMaxScroll
              : 0;

          lenis.resize();

          const nextMaxScroll = Math.max(
            wrapper.scrollHeight - wrapper.clientHeight,
            0,
          );

          lenis.scrollTo(progress * nextMaxScroll, {
            immediate: true,
            force: true,
          });

          updateScrollMetrics();
        });
      });
    };

    updateScrollMetrics();
    wrapper.addEventListener("scroll", updateScrollMetrics, { passive: true });
    window.addEventListener("resize", restoreScrollProgress);
    window.addEventListener("orientationchange", restoreScrollProgress);

    // Integrate Lenis with Framer Motion's RAF loop
    // This ensures perfect sync between Lenis smooth scrolling and Framer Motion animations
    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      wrapper.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("resize", restoreScrollProgress);
      window.removeEventListener("orientationchange", restoreScrollProgress);
      cancelAnimationFrame(resizeFrameId);
      cancelAnimationFrame(settleFrameId);
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [storyElementRef, story, lenisRef]);
}
