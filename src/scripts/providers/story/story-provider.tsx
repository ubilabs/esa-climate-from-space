import { PropsWithChildren, useRef, RefObject, useCallback } from "react";

import Lenis from "lenis";

import { AnchorKey, Story } from "../../types/story";
import { StoryContext } from "./use-story";

export interface StoryContextValue {
  story: Story | null;
  storyElementRef: RefObject<HTMLDivElement | null>;
  lenisRef: RefObject<Lenis | null>;
  getScrollAnchorRefsMap: () => Map<string, Element>;
  setScrollAnchorRefs: (
    key: string,
  ) => (node: HTMLElement | null | undefined) => void;
}

interface StoryProviderProps extends PropsWithChildren {
  story: Story | null;
}

// Natural-ish order: "1-2-10" after "1-2-3"
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export function StoryProvider({ children, story }: StoryProviderProps) {
  // Reference to the story container element.
  const storyElementRef = useRef<HTMLDivElement | null>(null);

  const lenisRef = useRef<Lenis | null>(null);
  // Holds references to anchor elements.
  // Add a node to this Map for the intersection observer to detect it and adjust the URL parameters accordingly.
  const scrollAnchorRefs = useRef<Map<string, Element>>(null);

  const getMap = useCallback(() => {
    return (scrollAnchorRefs.current ??= new Map<AnchorKey, HTMLElement>());
  }, []);

  const getScrollAnchorRefsMap = useCallback(() => {
    const map = getMap();
    return new Map(
      [...map.entries()].sort(([a], [b]) => collator.compare(a, b)),
    );
  }, [getMap]);

  const setScrollAnchorRefs = useCallback(
    (key: string) => (node: HTMLElement | undefined | null) => {
      const map = getMap();

      if (node) {
        map.set(key, node);
      } else {
        map.delete(key);
      }
    },
    [getMap],
  );

  return (
    <StoryContext
      value={{
        story,
        storyElementRef,
        getScrollAnchorRefsMap,
        setScrollAnchorRefs,
        lenisRef,
      }}
    >
      {children}
    </StoryContext>
  );
}
