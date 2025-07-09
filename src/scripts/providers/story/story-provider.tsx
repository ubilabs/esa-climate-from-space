import { useState, PropsWithChildren } from "react";

import { useLocation } from "react-router-dom";

import { Story } from "../../types/story";
import { StoryContext } from "./use-story";
import { extractSlideIndex } from "../../libs/content-url-parameter";
import { useStoryAutoScroll } from "../../hooks/use-story-auto-scroll";

export interface StoryContextValue {
  story: Story | null;
  storyElement: HTMLDivElement | null;
  setStoryElement: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  storySlideIndex: number;
  setStorySlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface StoryProviderProps extends PropsWithChildren {
  story: Story;
}

export function StoryProvider({ children, story }: StoryProviderProps) {
  const location = useLocation();
  const [storySlideIndex, setStorySlideIndex] = useState(
    extractSlideIndex(location.pathname),
  );
  const [storyElement, setStoryElement] = useState<HTMLDivElement | null>(null);

  // useStoryAutoScroll(storyElement);

  return (
    <StoryContext
      value={{
        story,
        storyElement,
        setStoryElement,
        storySlideIndex,
        setStorySlideIndex,
      }}
    >
      {children}
    </StoryContext>
  );
}
