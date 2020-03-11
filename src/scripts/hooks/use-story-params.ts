import {useRouteMatch, useParams} from 'react-router-dom';

import {StoryMode} from '../types/story-mode';

interface StoryParams {
  storyId: string;
  slideIndex: string;
}

interface ShowCaseParams {
  storyIds: string;
  storyIndex: string;
  slideIndex: string;
}

function isShowCaseParams(
  params: StoryParams | ShowCaseParams
): params is ShowCaseParams {
  return (params as ShowCaseParams).storyIds !== undefined; // eslint-disable-line no-undefined
}

export const useStoryParams = () => {
  const matchStories = useRouteMatch('/stories/:storyId');
  const matchPresent = useRouteMatch('/present/:storyId');
  const matchShowCase = useRouteMatch('/showcase/:storyIds');

  const params = useParams<StoryParams | ShowCaseParams>();
  const storyIds = isShowCaseParams(params)
    ? params.storyIds.split('&')
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
  }

  if (!mode) {
    return null;
  }

  return {mode, storyIds, storyIndex, slideIndex};
};
