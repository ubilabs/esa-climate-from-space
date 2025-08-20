import { categoryTags } from "../config/main";
import { parseUrl } from "./globe-url-parameter";

export function extractStoryId(urlPath: string | undefined): string | null {
  const storyIdPattern = /(story-\d+)\//;
  const match = urlPath?.match(storyIdPattern);
  return match ? match[1] : null;
}

// Utility: parse last part of pathname as number
export function extractSlideIndex(pathname: string): number {
  const lastPart = pathname.split("/").pop() || "";
  const index = parseInt(lastPart, 10);
  return isNaN(index) ? 0 : index;
}

// note: we do not use the location.search prop here because the HashRouter
// stores the query parameters in the location.hash prop
export function parseContentUrl() {

  const urlPath: string | undefined = location.href.split("#")[1];
  const storyId = extractStoryId(urlPath);

  const categories = categoryTags;

  const selectedCategory = categories.find((cat) => urlPath?.includes(cat)) || null

  const layerId = parseUrl()?.layerIds?.mainId;
  return {
    category: selectedCategory,
    contentId: layerId || storyId,
  };
}
