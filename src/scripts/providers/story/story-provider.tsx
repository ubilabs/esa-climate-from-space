import { PropsWithChildren, useRef, RefObject, useCallback } from "react";

import { Story } from "../../types/story";
import { StoryContext } from "./use-story";

export interface StoryContextValue {
  story: Story | null;
  storyElementRef: RefObject<HTMLDivElement | null>;
  getScrollAnchorRefsMap: () => Map<string, Element>;
  setScrollAnchorRefs: (
    key: string,
  ) => (node: HTMLElement | null | undefined) => void;
}

interface StoryProviderProps extends PropsWithChildren {
  story: Story | null;
}

export function StoryProvider({ children, story }: StoryProviderProps) {
  // Reference to the story container element.
  const storyElementRef = useRef<HTMLDivElement | null>(null);

  // Holds references to anchor elements.
  // Add a node to this Map for the intersection observer to detect it and adjust the URL parameters accordingly.
  const scrollAnchorRefs = useRef<Map<string, Element>>(null);

  const getScrollAnchorRefsMap = useCallback(() => {
    if (!scrollAnchorRefs.current) {
      // Initialize the Map on first usage.
      scrollAnchorRefs.current = new Map();
    }
    return scrollAnchorRefs.current;
  }, []);

  const setScrollAnchorRefs = useCallback(
    (key: string) => (node: HTMLElement | undefined | null) => {
      const map = getScrollAnchorRefsMap();
      if (node) {
        map.set(key, node);
      } else {
        map.delete(key);
      }
    },
    [getScrollAnchorRefsMap],
  );

  return (
    <StoryContext
      value={{
        story,
        storyElementRef,
        getScrollAnchorRefsMap,
        setScrollAnchorRefs,
      }}
    >
      {children}
    </StoryContext>
  );
}
