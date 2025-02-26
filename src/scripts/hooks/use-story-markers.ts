import { useSelector } from "react-redux";
import { storyListSelector } from "../selectors/story/list";

export const useContentMarker = (selectedStoryId: string | null) => {
  const stories = useSelector(storyListSelector);
  const selectedStory = stories.find((story) => story.id === selectedStoryId);

  if (!selectedStory) {
    return null;
  }

  const marker = {
    id: selectedStory.id,
    title: selectedStory.title,
    position: selectedStory.position,
    link: `/stories/${selectedStory.id}/0`,
    tags: selectedStory.tags,
  };

  return marker;
};
