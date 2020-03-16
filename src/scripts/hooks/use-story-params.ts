import {useRouteMatch, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {State} from '../reducers';
import {selectedStorySelector} from '../selectors/story/selected';

import {StoryMode} from '../types/story-mode';
import {storyListSelector} from '../selectors/story/list';

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

  const currentStoryId =
    mode === StoryMode.Showcase ? storyIds[storyIndex || 0] : storyIds[0];

  const selectedStory = useSelector((state: State) =>
    selectedStorySelector(state, currentStoryId)
  );

  const storyList = useSelector(storyListSelector);
  const storyListItem = storyList.find(story => story.id === currentStoryId);

  return {
    mode,
    storyIds,
    storyIndex,
    slideIndex,
    currentStoryId,
    storyListItem,
    selectedStory
  };
};
