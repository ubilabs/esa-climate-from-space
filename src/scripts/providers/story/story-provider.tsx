import {
  useState,
  PropsWithChildren,
  SetStateAction,
  Dispatch,
  useRef,
  RefObject,
} from "react";

import { Story } from "../../types/story";
import { StoryContext } from "./use-story";
import { extractSlideIndex } from "../../libs/content-url-parameter";
import { getHashPathName } from "../../libs/get-hash-path";

export interface StoryContextValue {
  story: Story | null;
  storyElement: HTMLDivElement | null;
  setStoryElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  hasInitialScrolled: RefObject<boolean>;
}

interface StoryProviderProps extends PropsWithChildren {
  story: Story;
}

export function StoryProvider({ children, story }: StoryProviderProps) {
  const [storyElement, setStoryElement] = useState<HTMLDivElement | null>(null);

  const initialSlideIndex = extractSlideIndex(getHashPathName());

  // Prevent initial scroll from triggering URL update
  const hasInitialScrolled = useRef(initialSlideIndex < 0);

  return (
    <StoryContext
      value={{
        story,
        storyElement,
        setStoryElement,
        hasInitialScrolled,
      }}
    >
      {children}
    </StoryContext>
  );
}
