import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { State } from "../reducers";
import { selectedStorySelector } from "../selectors/story/selected";
import { contentSelector } from "../selectors/content";
import { useMemo } from "react";

interface StoryParams {
  category: string;
  storyId: string;
  slideIndex: string;
  storyIds?: undefined;
  storyIndex: undefined;
}

interface ShowCaseParams {
  storyId: undefined;
  category: string;
  storyIds: string;
  storyIndex: string;
  slideIndex: string;
}

function isShowCaseParams(storyIds: string | undefined) {
  return (storyIds as Partial<ShowCaseParams>) !== undefined;
}

export const useContentParams = () => {
  const {
    storyIds,
    storyId: rawStoryId,
    category: paramCategory,
    slideIndex: paramSlideIndex,
    storyIndex: paramStoryIndex,
  } = useParams<Partial<StoryParams> | Partial<ShowCaseParams>>();

  const processedStoryIds = useMemo(() => {
    if (isShowCaseParams(storyIds) && storyIds) {
      return storyIds.split("&");
    } else if (rawStoryId) {
      return [rawStoryId];
    }
    return [];
  }, [storyIds, rawStoryId]);

  const storyIndex = useMemo(() => {
    return paramStoryIndex ? parseInt(paramStoryIndex, 10) : null;
  }, [paramStoryIndex]);

  const slideIndex = useMemo(() => {
    return paramSlideIndex ? parseInt(paramSlideIndex, 10) : null;
  }, [paramSlideIndex]);

  const currentStoryId = useMemo(() => {
    return processedStoryIds[storyIndex || 0];
  }, [processedStoryIds, storyIndex]);

  const selectedStory = useSelector((state: State) =>
    selectedStorySelector(state, currentStoryId),
  );

  const initialCategory = paramCategory || null;

  const { category: persistedCategory } = useSelector(contentSelector);

  const category = initialCategory || persistedCategory || undefined;

  return {
    storyIds: processedStoryIds,
    storyIndex,
    slideIndex,
    currentStoryId,
    selectedStory,
    category,
  };
};
