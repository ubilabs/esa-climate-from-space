import { useEffect } from "react";
import { useStory } from "../providers/story/use-story";

export function useLenisToggle(
  isOff: boolean,
  toCenterElement?: HTMLElement | null,
) {
  const { lenisRef } = useStory();

  useEffect(() => {
    if (isOff) {
      lenisRef.current?.stop();
      if (toCenterElement) {
        lenisRef.current?.scrollTo(toCenterElement, {
          force: true,
          duration: 0.5, // Reduce duration for faster scrolling
        });
      }
    } else {
      lenisRef.current?.start();
    }
  }, [isOff, lenisRef, toCenterElement]);
}
