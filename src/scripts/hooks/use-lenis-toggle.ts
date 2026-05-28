import { useEffect, RefObject } from 'react';
import { useStory } from '../providers/story/use-story';

export function useLenisToggle(
  isOff: boolean,
  toCenterElementRef?: RefObject<HTMLElement | null>,
) {
  const { lenisRef } = useStory();

  useEffect(() => {
    const toCenterElement = toCenterElementRef?.current;
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
  }, [isOff, lenisRef, toCenterElementRef]);
}
