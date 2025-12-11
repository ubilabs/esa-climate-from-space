import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import removeMarkdown from "remove-markdown";
import { createContext, use } from "react";
import { getStoryMediaType } from "../libs/get-story-media-type";
import { LayerListItem } from "../types/layer-list";
import { StoryListItem } from "../types/story-list";
import { LegacySlide } from "../types/legacy-story";

export type SearchLayerItem = LayerListItem;
export type SearchStoryItem = StoryListItem & {
  slides?: Array<LegacySlide>;
};

type SearchContextValue = {
  layers: SearchLayerItem[];
  stories: SearchStoryItem[];
};

export const SearchContext = createContext<SearchContextValue | undefined>(
  undefined,
);

export type SearchResult = FuseResult<SearchLayerItem | SearchStoryItem> & {
  type: string;
};

const fuseConfig = {
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  ignoreLocation: true,
  findAllMatches: true,
};

export function useSearch() {
  const context = use(SearchContext);

  return (query: string): SearchResult[] => {
    if (!query) return [];

    const { layers, stories } = context ?? { layers: [], stories: [] };

    const layerSearcher =
      layers.length > 0
        ? new Fuse(layers, {
            keys: ["name", "shortName", "description"],
            ...fuseConfig,
            minMatchCharLength: query.length,
          })
        : null;

    const storySearcher =
      stories.length > 0
        ? new Fuse(
            stories.map((story) => ({
              ...story,
              slides:
                story.slides?.map((slide) => ({
                  ...slide,
                  text: removeMarkdown(slide.text ?? ""),
                  shortText: removeMarkdown(slide.shortText ?? ""),
                })) || undefined,
            })),
            {
              keys: [
                "title",
                "subtitle",
                "description",
                "slides.text",
                "slides.shortText",
                "slides.layerDescription",
                "slides.imageCaptions",
              ],
              ...fuseConfig,
              minMatchCharLength: query.length,
            },
          )
        : null;

    const layerResults: SearchResult[] = layerSearcher
      ? layerSearcher
          .search(query)
          .map((result) => ({ ...result, type: "layer" as const }))
      : [];

    const storyResults: SearchResult[] = storySearcher
      ? storySearcher.search(query).map((result) => ({
          ...result,
          type: getStoryMediaType(
            result.item,
            stories.map((story) => ({ ...story, slides: story.slides || [] })),
          ),
        }))
      : [];

    // Combine and sort by score (lower is better)
    return [...layerResults, ...storyResults].sort(
      (a, b) => (a.score ?? 1) - (b.score ?? 1),
    );
  };
}
