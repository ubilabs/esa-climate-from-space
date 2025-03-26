import { useGetStoryListQuery } from "../services/api";
import { Language } from "../types/language";

export const useContentMarker = (
  selectedStoryId: string | null,
  language: Language,
) => {
  const { data: stories } = useGetStoryListQuery(language);

  if (!stories) {
    return null;
  }

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
