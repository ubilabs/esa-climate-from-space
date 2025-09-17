import { RefObject, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lenis from "lenis";

import config from "../config/main";

import { getCssVarPx } from "../libs/get-css-var-in-px";

import { useAppRouteFlags } from "./use-app-route-flags";
import { useContentParams } from "./use-content-params";
import { useStory } from "../providers/story/use-story";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrollElements(
  elements: Element[],
  abortSignal: { aborted: boolean },
  storyIndex: number | null,
  storyIds: string[],
  navigate: (path: string, options: { replace: boolean }) => void,
  lenisRef: RefObject<Lenis | null>,
) {

  const headerHeight = getCssVarPx("--header-height");

  for (let i = 0; i < elements.length; i++) {
    lenisRef.current?.scrollTo(i * (window.innerHeight - headerHeight));

    if (abortSignal.aborted) {
      break;
    }
    await delay(config.delay);
  }

  if (abortSignal.aborted || storyIndex === null) {
    return;
  }

  const nextStoryIndex = storyIndex + 1;
  if (nextStoryIndex < storyIds.length) {
    navigate(`/showcase/${storyIds.join("&")}/${nextStoryIndex}/0`, {
      replace: true,
    });
  } else {
    navigate(`/showcase/${storyIds.join("&")}/0/0`, { replace: true });

    if (!abortSignal.aborted) {
      await scrollElements(
        elements,
        abortSignal,
        0,
        storyIds,
        navigate,
        lenisRef,
      );
    }
  }
}

export const useAutoScrollInShowcase = () => {
  const { getScrollAnchorRefsMap, lenisRef } = useStory();
  const { isShowCaseView } = useAppRouteFlags();
  const navigate = useNavigate();
  const { storyIds, storyIndex } = useContentParams();

  const scrollableElements = Array.from(getScrollAnchorRefsMap().values());

  useEffect(() => {
    // delay execution until all DOM nodes are created
    if (isShowCaseView && scrollableElements.length) {
      const abortSignal = { aborted: false };

      (async () => {
        await scrollElements(
          scrollableElements,
          abortSignal,
          storyIndex,
          storyIds,
          navigate,
          lenisRef,
        );
      })();

      return () => {
        abortSignal.aborted = true;
      };
    }
  }, [
    lenisRef,
    isShowCaseView,
    storyIndex,
    storyIds,
    navigate,
    scrollableElements,
  ]);
};
