import { PropsWithChildren, useRef, RefObject } from "react";

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
  // const [storyElement, setStoryElement] = useState<HTMLDivElement | null>(null);
  const storyElementRef = useRef<HTMLDivElement | null>(null);
  const scrollableFormatRefs = useRef<Map<string, Element>>(null);


  function getScrollableFormatsMap() {
    if (!scrollableFormatRefs.current) {
      // Initialize the Map on first usage.
      scrollableFormatRefs.current = new Map();
    }
    return scrollableFormatRefs.current;
  }

  return (
    <StoryContext
      value={{
        story,
        storyElementRef,
        scrollableFormatRefs,
        getScrollableFormatsMap,
      }}
    >
      {children}
    </StoryContext>
  );
}
