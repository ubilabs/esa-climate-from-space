import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import config from "../config/main";

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
) {
  for (const element of elements) {
    if (abortSignal.aborted) {
      break;
    }
    element.scrollIntoView({ behavior: "smooth" });
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
      await scrollElements(elements, abortSignal, 0, storyIds, navigate);
    }
  }
}

export const useAutoScrollInShowcase = () => {
  const { getScrollableFormatsMap, isLastNodeRegistered } = useStory();
  const { isShowCaseView, isPresentView } = useAppRouteFlags();
  const navigate = useNavigate();
  const { storyIds, storyIndex } = useContentParams();

  useEffect(
    () => {
      if (isShowCaseView || isPresentView) {
        const elements = getScrollableFormatsMap();
        const scrollableElements = Array.from(elements.values());
        const abortSignal = { aborted: false };

        (async () => {
          await scrollElements(
            scrollableElements,
            abortSignal,
            storyIndex,
            storyIds,
            navigate,
          );
        })();

        return () => {
          abortSignal.aborted = true;
        };
      }
    },
    // navigate is missing in the dependency array to avoid unnecessary re-renders. Ideally, we would get it from a stable context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isLastNodeRegistered,
      isShowCaseView,
      isPresentView,
      getScrollableFormatsMap,
      storyIndex,
      storyIds,
    ],
  );
};
