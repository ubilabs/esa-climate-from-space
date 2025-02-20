import { useSelector } from "react-redux";
import { filterStories } from "../libs/filter-stories";

import { selectedLayerIdsSelector } from "../selectors/layers/selected-ids";
import { selectedTagsSelector } from "../selectors/story/selected-tags";
import { storyListSelector } from "../selectors/story/list";

export const useStoryMarkers = () => {
  // const selectedLayers = useSelector(selectedLayerIdsSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  console.log(selectedTags, "selectedTags");
  const stories = useSelector(storyListSelector);
  console.log("stories", stories);
  const filteredStories = filterStories(stories, selectedTags);
  console.log("filterStories", filterStories);
  //  const hideMarkers = Boolean(
  //    selectedLayers.mainId || selectedLayers.compareId,
  //  );
  //
  //  if (hideMarkers) {
  //    return [];
  //  }

  const storyMarkers = filteredStories
    .map((story) => ({
    id: story.id,
      title: story.title,
      position: story.position,
      link: `/stories/${story.id}/0`,
      tags: story.tags,
    }))
    .filter((marker) => marker.position);

  return storyMarkers;
};
