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

  const storyMarkers = stories
    .map(story => ({
      title: story.title,
      position: story.position,
      link: `/stories/${story.id}/0`
    }))
    .filter(marker => marker.position);

  return storyMarkers;
};
