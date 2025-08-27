import { useEffect, useRef, useCallback } from "react";

import Lenis from "lenis";

import { useStory } from "../providers/story/use-story";
import config from "../config/main";

export function useLenisForStory() {
  const { storyElementRef, story, lenisRef } = useStory();

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
    wrapper.classList.add("lenis-wrapper");

    const lenis = new Lenis({
      // important: bind Lenis to the storyElementRef
      wrapper: wrapper,
      ...config.lenisOptions,
    });
    lenisRef.current = lenis;
    startRaf();

    return () => {
      stopRaf();
      lenis.destroy();
      lenisRef.current = null;
      wrapper.classList.remove("lenis-wrapper");
    };
  }, [storyElementRef, story, lenisRef, startRaf, stopRaf]);
}
