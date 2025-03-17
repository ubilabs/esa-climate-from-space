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

export const useStoryParams = () => {
  const matchStories = useRouteMatch("/stories/:storyId");
  const matchPresent = useRouteMatch("/present/:storyId");
  const matchShowCase = useRouteMatch("/showcase/:storyIds");
  const matchCategory = useRouteMatch("/:category/stories/:storyId");
  const matchContent = useRouteMatch("/:contentType/:category/stories/:storyId");

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
  } else if (matchContent) {
    mode = StoryMode.Stories;
  }

  const currentStoryId =
    mode === StoryMode.Showcase ? storyIds[storyIndex || 0] : storyIds[0];

  const selectedStory = useSelector((state: State) =>
    selectedStorySelector(state, currentStoryId),
  );

  const { category } = params;

  return {
    mode,
    storyIds,
    storyIndex,
    slideIndex,
    currentStoryId,
    selectedStory,
    category
  };
};
