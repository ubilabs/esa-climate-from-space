import {  useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { State } from "../reducers";
import { selectedStorySelector } from "../selectors/story/selected";
import { contentSelector } from "../selectors/content";

interface StoryParams {
  category: string;
  storyId: string;
  slideIndex: string;
}

interface ShowCaseParams {
  category: string;
  storyIds: string;
  storyIndex: string;
  slideIndex: string;
}

function isShowCaseParams(
  params: Partial<StoryParams> | Partial<ShowCaseParams>,
): params is Partial<ShowCaseParams> {
  return (params as Partial<ShowCaseParams>).storyIds !== undefined;
}

export const useContentParams = () => {

  const params = useParams<Partial<StoryParams> | Partial<ShowCaseParams>>();
  const storyIds = isShowCaseParams(params) && params.storyIds
    ? params.storyIds.split("&")
    : params.storyId ? [params.storyId] : [];

  const storyIndex = isShowCaseParams(params) && params.storyIndex
    ? parseInt(params.storyIndex, 10)
    : null;

  const slideIndex = params.slideIndex
    ? parseInt(params.slideIndex, 10)
    : null;
  const currentStoryId = storyIds[storyIndex || 0];

  const selectedStory = useSelector((state: State) =>
    selectedStorySelector(state, currentStoryId),
  );

  // Get initial category from URL params, or use null if not present
  const initialCategory = params.category || null;

  // Get persisted category from the Redux store
  const {category: persistedCategory} = useSelector(contentSelector)

  // Use the URL category if available, otherwise fallback to persisted category
  const  category  =  initialCategory || persistedCategory || undefined;

  return {
    storyIds,
    storyIndex,
    slideIndex,
    currentStoryId,
    selectedStory,
    category,
  };
};
