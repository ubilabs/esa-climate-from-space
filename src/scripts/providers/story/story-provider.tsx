import { PropsWithChildren, useRef, RefObject, useCallback } from "react";

import { Story } from "../../types/story";
import { StoryContext } from "./use-story";

export interface StoryContextValue {
  story: Story | null;
  storyElementRef: RefObject<HTMLDivElement | null>;
  getScrollableFormatsMap: () => Map<string, Element>;
  setScrollableFormatRefs: (
    key: string,
  ) => (node: HTMLElement | null | undefined) => void;
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

  const setScrollableFormatRefs = useCallback(
    (key: string) => (node: HTMLElement | undefined | null) => {
      const map = getScrollableFormatsMap();
      if (node) {
        map.set(key, node);
      } else {
        map.delete(key);
      }
    },
    [getScrollableFormatsMap],
  );

  return (
    <StoryContext
      value={{
        story,
        storyElementRef,
        getScrollableFormatsMap,
        setScrollableFormatRefs,
      }}
    >
      {children}
    </StoryContext>
  );
}
