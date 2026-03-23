import { useEffect } from "react";
import { frame, cancelFrame } from "motion/react";

import Lenis from "lenis";

import { useStory } from "../providers/story/use-story";
import config from "../config/main";
import { useScreenInfo } from "./use-screen-info";
import { useAppRouteFlags } from "./use-app-route-flags";

export function useLenisForStory() {
  const { storyElementRef, story, lenisRef, getScrollAnchorRefsMap } =
    useStory();
  const { isStoryEEI } = useAppRouteFlags();

  const { screenHeight } = useScreenInfo();

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

    // Integrate Lenis with Framer Motion's RAF loop
    // This ensures perfect sync between Lenis smooth scrolling and Framer Motion animations
    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [
    isStoryEEI,
    screenHeight,
    getScrollAnchorRefsMap,
    storyElementRef,
    story,
    lenisRef,
  ]);
}
