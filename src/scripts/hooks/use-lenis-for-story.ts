import { useEffect } from "react";
import { frame, cancelFrame } from "motion/react";

import Lenis from "lenis";
import Snap from "lenis/snap";

import { getCssVarPx } from "../libs/get-css-var-in-px";

import { useStory } from "../providers/story/use-story";
import config from "../config/main";
import { useScreenInfo } from "./use-screen-info";
import { useAppRouteFlags } from "./use-app-route-flags";

export const DATA_NO_SNAP_ATTR = "data-no-snap";

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

    // We want to snap anchor elements into place when scrolling
    // To exclude an element from snapping, add the data-no-snap attribute to it
    const snap = new Snap(lenis, {
      type: "proximity", // 'mandatory', 'proximity'
      distanceThreshold: "50%",
      debounce: 500,
    });

    // We need to account for the header height when snapping
    const headerHeight = getCssVarPx("--header-height");

    snap.viewport.height = screenHeight + headerHeight;

    const options = isStoryEEI
      ? { align: "end", ignoreSticky: false }
      : {
          align: "center",
          ignoreTransform: true,
          ignoreSticky: false,
        };

    getScrollAnchorRefsMap().forEach((el) => {
      // skip element if it has the data-no-snap attribute
      if (el.hasAttribute(DATA_NO_SNAP_ATTR)) return;
      snap.addElement(el as HTMLElement, options);
    });

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
