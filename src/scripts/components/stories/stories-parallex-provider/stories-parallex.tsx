import {
  createContext,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  use,
  useState,
} from "react";
import { ParallaxProvider, ParallaxProviderProps } from "react-scroll-parallax";

import { LegacyStory } from "../../../types/story";

interface StoryContextProps {
  story: LegacyStory | null;
  setStory: Dispatch<SetStateAction<LegacyStory | null>>;
}

const StoryContext = createContext<StoryContextProps | undefined>(undefined);

export const CustomParallaxProvider: FunctionComponent<
  ParallaxProviderProps & {
    children: ReactNode;
  }
> = ({ children, ...parallaxProviderProps }) => {
  const [story, setStory] = useState<LegacyStory | null>("test");
  return (
    <StoryContext.Provider value={{ story, setStory }}>
      <ParallaxProvider {...parallaxProviderProps}>{children}</ParallaxProvider>
    </StoryContext.Provider>
  );
};

export function useStoryContext(): StoryContextProps {
  const context = use(StoryContext);
  if (!context) {
    throw new Error(
      "useStoryContext must be used within a CustomParallaxProvider",
    );
  }
  return context;
}
