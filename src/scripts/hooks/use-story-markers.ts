import {useSelector} from 'react-redux';

import {selectedLayerIdsSelector} from '../selectors/layers/selected-ids';
import {StoriesStateSelector} from '../selectors/story/story-state';

export const useStoryMarkers = () => {
  const selectedLayers = useSelector(selectedLayerIdsSelector);
  const stories = useSelector(StoriesStateSelector).list;
  const hideMarkers = Boolean(
    selectedLayers.mainId || selectedLayers.compareId
  );

  if (hideMarkers) {
    return [];
  }

  const storyMarkers = stories.map(story => ({
    id: story.id,
    title: story.title,
    position: story.position
  }));

  return storyMarkers;
};
