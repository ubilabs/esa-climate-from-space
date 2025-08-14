import { PropsWithChildren, useRef, RefObject, useCallback } from "react";

import { Story } from "../../types/story";
import { StoryContext } from "./use-story";

export interface StoryContextValue {
  story: Story | null;
  storyElementRef: RefObject<HTMLDivElement | null>;
  scrollableFormatRefs: RefObject<Map<string, Element> | null>;
  getScrollableFormatsMap: () => Map<string, Element>;
}

interface StoryProviderProps extends PropsWithChildren {
  story: Story | null;
}

export function StoryProvider({ children, story }: StoryProviderProps) {
  const storyElementRef = useRef<HTMLDivElement | null>(null);
  const scrollableFormatRefs = useRef<Map<string, Element>>(null);


  const getScrollableFormatsMap = useCallback(() => {
    if (!scrollableFormatRefs.current) {
      // Initialize the Map on first usage.
      scrollableFormatRefs.current = new Map();
    }
    return scrollableFormatRefs.current;
  }, []);

  return (
    <StoryContext.Provider
      value={{
        story,
        storyElementRef,
        scrollableFormatRefs,
        getScrollableFormatsMap,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}
