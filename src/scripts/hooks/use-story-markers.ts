import {useSelector} from 'react-redux';
import {filterStories} from '../libs/filter-stories';

import {selectedLayerIdsSelector} from '../selectors/layers/selected-ids';
import {selectedTagsSelector} from '../selectors/story/selected-tags';
import {StoriesStateSelector} from '../selectors/story/story-state';

export const useStoryMarkers = () => {
  const selectedLayers = useSelector(selectedLayerIdsSelector);
  const stories = useSelector(StoriesStateSelector).list;
  const selectedTags = useSelector(selectedTagsSelector);
  const filteredStories = filterStories(stories, selectedTags);
  const hideMarkers = Boolean(
    selectedLayers.mainId || selectedLayers.compareId
  );

  if (hideMarkers) {
    return [];
  }

  const storyMarkers = filteredStories
    .map(story => ({
      title: story.title,
      position: story.position,
      link: `/stories/${story.id}/0`
    }))
    .filter(marker => marker.position);

  return storyMarkers;
};
