import stories from "../../../storage/stories/stories-en.json";

export function getStorySplashImage(storyId: string): string {
  const image = stories.find((story) => story.id === storyId)?.image;
  if (!image) {
    return "";
  }
  return `/stories/${storyId}/${image}`;
}
