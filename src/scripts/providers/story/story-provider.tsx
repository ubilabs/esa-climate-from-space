import {
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Story } from "../../types/story";
import { StoryContext } from "./use-story";

export interface StoryContextValue {
  story: Story | null;
  setStory: Dispatch<SetStateAction<Story | null>>;
  storyElement: HTMLDivElement | null;
  setStoryElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
  // storyRef: RefObject<HTMLDivElement | null>;
  // setStoryRef: Dispatch<SetStateAction<RefObject<HTMLDivElement | null>>>;
  // setParallaxProviderProps: Dispatch<SetStateAction<ParallaxProviderProps>>;
}

export function StoryProvider({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<Story | null>(null);
  const [storyElement, setStoryElement] = useState<HTMLDivElement | null>(null);
  // const [storyRef, setStoryRef] =
  //   useState<RefObject<HTMLDivElement | null>>(null);
  // const [parallaxProviderProps, setParallaxProviderProps] =
  //   useState<ParallaxProviderProps>({});

  return (
    <StoryContext value={{ story, setStory, storyElement, setStoryElement }}>

      {/* <ParallaxProvider {...parallaxProviderProps}>{children}</ParallaxProvider> */}
      {children}
    </StoryContext>
  );
}
