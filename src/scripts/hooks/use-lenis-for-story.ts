import { useEffect, useRef, useCallback } from "react";

import Lenis from "lenis";
import Snap from "lenis/snap";

import { getCssVarPx } from "../libs/get-css-var-in-px";

import { useStory } from "../providers/story/use-story";
import config from "../config/main";
import { useScreenSize } from "./use-screen-size";

export const DATA_NO_SNAP_ATTR = "data-no-snap";

export function useLenisForStory() {
  const { storyElementRef, story, lenisRef, getScrollAnchorRefsMap } =
    useStory();

  // stable raf loop
  const rafRef = useRef<number | null>(null);

  const { screenHeight } = useScreenSize();

  const startRaf = useCallback(() => {
    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);
  }, [lenisRef]);

  const stopRaf = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Any scrolling should be handled by lenis, so we disable the browser's native scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!storyElementRef.current || !story) return;

    const wrapper = storyElementRef.current;

    const lenis = new Lenis({
      // important: bind Lenis to the storyElementRef
      wrapper: wrapper,
      ...config.lenisOptions,
    });

    lenisRef.current = lenis;
    startRaf();

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

    getScrollAnchorRefsMap().forEach((el) => {
      // skip element if it has the data-no-snap attribute
      if (el.hasAttribute(DATA_NO_SNAP_ATTR)) return;
      snap.addElement(el as HTMLElement, {
        align: "center",
        ignoreTransform: true,
        ignoreSticky: false,
      });
    });

    return () => {
      stopRaf();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [
    screenHeight,
    getScrollAnchorRefsMap,
    storyElementRef,
    story,
    lenisRef,
    startRaf,
    stopRaf,
  ]);
}
