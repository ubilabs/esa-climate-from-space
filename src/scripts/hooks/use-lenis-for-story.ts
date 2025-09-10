import { useEffect, useRef, useCallback } from "react";

import Lenis from "lenis";
import Snap from "lenis/snap";

import { useStory } from "../providers/story/use-story";
import config from "../config/main";

export function useLenisForStory() {
  const { storyElementRef, story, lenisRef, getScrollAnchorRefsMap } =
    useStory();

  // stable raf loop
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!storyElementRef.current || !story) return;

    const wrapper = storyElementRef.current;
    // wrapper.classList.add("lenis-wrapper");

    const lenis = new Lenis({
      // important: bind Lenis to the storyElementRef
      wrapper: wrapper,
      ...config.lenisOptions,
    });

    lenisRef.current = lenis;
    startRaf();

    const snap = new Snap(lenis, {
      type: "proximity", // 'mandatory', 'proximity'
      // velocityThreshold: 1.2,
      distanceThreshold: "50%",
      debounce: 500,
      // duration: 2,
      // easing: (t) => t,

      onSnapStart: (snap) => {
        console.log("onSnapStart", snap);
      },
      onSnapComplete: (snap) => {
        console.log("onSnapComplete", snap);
      },
    });

    snap.viewport.height = window.innerHeight + 54;

    const scrollSnapElements =
      storyElementRef.current.querySelectorAll<HTMLElement>("[data-scroll]");

    scrollSnapElements.forEach((el) => {
      snap.addElement(el, {
        align: "center",
        ignoreTransform: true,
        ignoreSticky: false,
      });
    });

    return () => {
      stopRaf();
      lenis.destroy();
      lenisRef.current = null;
      // wrapper.classList.remove("lenis-wrapper");
    };
  }, [storyElementRef, story, lenisRef, startRaf, stopRaf]);
}
