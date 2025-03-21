import { useRouteMatch, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { State } from "../reducers";
import { selectedStorySelector } from "../selectors/story/selected";

import { StoryMode } from "../types/story-mode";

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
  params: StoryParams | ShowCaseParams,
): params is ShowCaseParams {
  return (params as ShowCaseParams).storyIds !== undefined;
}

export const useContentParams = () => {
  const matchStories = useRouteMatch(["/stories/:storyId", "/:category/stories/:storyId"]);
  const matchPresent = useRouteMatch("/present/:storyId");
  const matchShowCase = useRouteMatch("/showcase/:storyIds");
  const matchCategory = useRouteMatch("/:category/stories/:storyId");

  const matchDataContent = useRouteMatch("/:category/data");
  const matchContentNavigation = useRouteMatch("/:category");
  const matchCategoryNavigation = useRouteMatch("/");

  const params = useParams<StoryParams | ShowCaseParams>();
  const storyIds = isShowCaseParams(params)
    ? params.storyIds.split("&")
    : [params.storyId];
  const storyIndex = isShowCaseParams(params)
    ? parseInt(params.storyIndex, 10)
    : null;
  const slideIndex = parseInt(params.slideIndex, 10);

  let mode = null;

  if (matchStories) {
    mode = StoryMode.Stories;
  } else if (matchPresent) {
    mode = StoryMode.Present;
  } else if (matchShowCase) {
    mode = StoryMode.Showcase;
  } else if (matchCategory) {
    mode = StoryMode.Stories;
  } else if (matchDataContent) {
    mode = StoryMode.Content;
  } else if (matchContentNavigation) {
    mode = StoryMode.NavContent;
  } else if (matchCategoryNavigation) {
    mode = StoryMode.NavCategory;
  }

  const currentStoryId =
    mode === StoryMode.Showcase ? storyIds[storyIndex || 0] : storyIds[0];

  const selectedStory = useSelector((state: State) =>
    selectedStorySelector(state, currentStoryId),
  );

  const isNavigation = mode === StoryMode.NavContent || mode === StoryMode.NavCategory;

  const { category } = params;

  return {
    mode,
    storyIds,
    storyIndex,
    slideIndex,
    currentStoryId,
    selectedStory,
    category,
    isNavigation,
  };
};
