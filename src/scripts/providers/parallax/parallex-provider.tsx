import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { ParallaxProvider, ParallaxProviderProps } from "react-scroll-parallax";
import { useStory } from "../story/use-story";

export const CustomParallaxProvider: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const userPrefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const [parallaxProviderProps, setParallaxProviderProps] = useState<
    Partial<ParallaxProviderProps>
  >({
    isDisabled: userPrefersReducedMotion,
  });
  // const parallaxProviderProps: ParallaxProviderProps = {};
  const { storyElement } = useStory();

  useEffect(() => {
    // if (!storyElement) {
    //   return;
    // }
    setParallaxProviderProps((prev) => ({
      ...prev,
      scrollContainer: storyElement || undefined,
    }));
  }, [storyElement]);

  return (
    <ParallaxProvider {...parallaxProviderProps}>{children}</ParallaxProvider>
  );
};
