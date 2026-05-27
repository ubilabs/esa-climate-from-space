import stories from "../../../storage/stories/stories-en.json";
import config from "../config/main";
import { replaceUrlPlaceholders } from "./replace-url-placeholders";

export function getStorySplashImage(storyId: string): string {
  const image = stories.find((story) => story.id === storyId)?.image;
  if (!image) {
    return "";
  }
  return replaceUrlPlaceholders(config.api.storySplashImage, {
    id: storyId,
    image,
  });
}
