import { GalleryItemType } from "../types/gallery-item";
import { LegacyStoryType } from "../types/story";
import { LegacyStory as LegacySlidesStory } from "../types/legacy-story";
import { SlideType } from "../types/slide-type";
import { SearchStoryItem } from "../types/search";

export function getStoryMediaType(
  item: object & { id: string },
  stories?: LegacyStoryType[] | LegacySlidesStory[] | SearchStoryItem[],
): string {
  let type = "blog";

  const story = stories?.find((story) => story.id === item.id);
  const galleyItemTypes =
    story &&
    "slides" in story &&
    new Set(
      story?.slides
        .map((slide) =>
          "galleryItems" in slide ? slide.galleryItems.flat() : [slide],
        )
        .flat()
        .map(({ type }) => type)
        .filter((type) => SlideType.Splashscreen !== type),
    );

  if (
    galleyItemTypes &&
    // if gallery only contains images or videos return media type
    galleyItemTypes.size === 1 &&
    (galleyItemTypes.has(GalleryItemType.Image) ||
      galleyItemTypes.has(SlideType.Image) ||
      galleyItemTypes.has(GalleryItemType.Video) ||
      galleyItemTypes.has(SlideType.Video))
  ) {
    type = [...galleyItemTypes][0];
  }
  return type;
}
