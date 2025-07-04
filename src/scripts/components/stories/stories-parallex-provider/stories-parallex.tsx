import {
  createContext,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  use,
  useEffect,
  useState,
} from "react";
import {
  ParallaxProvider,
  ParallaxProviderProps,
  useParallaxController,
} from "react-scroll-parallax";

import { Story } from "../../../types/story";
import { useLocation } from "react-router-dom";

interface StoryContextProps {
  story: Story | null;
  setStory: Dispatch<SetStateAction<Story | null>>;
  setParallaxProviderProps: Dispatch<SetStateAction<ParallaxProviderProps>>;
}

const StoryContext = createContext<StoryContextProps | undefined>(undefined);

export const CustomParallaxProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {

  const [story, setStory] = useState<Story | null>(null);
  const [parallaxProviderProps, setParallaxProviderProps] =
    useState<ParallaxProviderProps>({});

  return (
    <StoryContext value={{ story, setStory, setParallaxProviderProps }}>
      <ParallaxProvider {...parallaxProviderProps}>{children}</ParallaxProvider>
    </StoryContext>
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

export function useUpdateControllerOnRouteChange() {
  const location = useLocation();
  const parallaxController = useParallaxController();

  useEffect(() => {
    parallaxController?.update();
  }, [location.pathname, parallaxController]);

  useEffect(() => {
    return () => {
      parallaxController?.destroy();
    };
  }, [parallaxController]);
}
