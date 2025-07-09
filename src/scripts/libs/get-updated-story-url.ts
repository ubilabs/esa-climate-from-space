export function getUpdatedStoryUrl(
  path: string,
  storySlideIndex: number,
): string {
  const pathParts = path.split("/");

  if (pathParts.length > 1) {
    pathParts[pathParts.length - 1] = storySlideIndex.toString();
  }

  return pathParts.join("/");
}
