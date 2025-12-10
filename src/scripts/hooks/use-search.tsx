import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import removeMarkdown from "remove-markdown";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStoryMediaType } from "../libs/get-story-media-type";
import { languageSelector } from "../selectors/language";
import { LayerListItem } from "../types/layer-list";
import { StoryListItem } from "../types/story-list";
import { LegacySlide } from "../types/legacy-story";

type SearchLayerItem = LayerListItem;
type SearchStoryItem = StoryListItem & {
  slides?: Array<LegacySlide>;
};

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
  const lang = useSelector(languageSelector);

  const [layers, setLayers] = useState<SearchLayerItem[]>([]);
  const [stories, setStories] = useState<SearchStoryItem[]>([]);

  useEffect(() => {
    fetch(`/index/storage-index-${lang}.json.gz`)
      .then((res) => res.json())
      .then((indexData) => {
        const layersArr: SearchLayerItem[] = Array.isArray(indexData.layers)
          ? indexData.layers.filter(Boolean)
          : [];
        const storiesArr: SearchStoryItem[] = Array.isArray(indexData.stories)
          ? indexData.stories.filter(Boolean)
          : [];
        setLayers(layersArr);
        setStories(storiesArr);
      });
  }, [lang]);

  const search = (query: string): SearchResult[] => {
    if (!query) return [];

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

  return { search, layers, stories };
}
