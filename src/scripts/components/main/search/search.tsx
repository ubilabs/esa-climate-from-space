import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import { useSelector } from "react-redux";
import { languageSelector } from "../../../selectors/language";
import { getStoryMediaType } from "../../../libs/get-story-media-type";
import removeMarkdown from "remove-markdown";
import { LayerListItem } from "../../../types/layer-list";
import { StoryListItem } from "../../../types/story-list";

export type SearchResult = FuseResult<LayerListItem | StoryListItem> & {
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

  const [layers, setLayers] = useState<LayerListItem[]>([]);
  const [stories, setStories] = useState<StoryListItem[]>([]);

  useEffect(() => {
    fetch(`/index/storage-index-${lang}.json.gz`)
      .then((res) => res.json())
      .then((indexData) => {
        // indexData is now { layers: [...], stories: [...] }
        const layersArr: LayerListItem[] = Array.isArray(indexData.layers)
          ? indexData.layers.filter(Boolean)
          : [];
        const storiesArr: StoryListItem[] = Array.isArray(indexData.stories)
          ? indexData.stories.filter(Boolean)
          : [];
        setLayers(layersArr);
        setStories(storiesArr);
      });
  }, [lang]);

  const search = (query: string): SearchResult[] => {
    if (!query) return [];

    // Recreate Fuse instances with query-length-specific minMatchCharLength
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
          type: getStoryMediaType(result.item, stories),
        }))
      : [];

    // Combine and sort by score (lower is better)
    return [...layerResults, ...storyResults].sort(
      (a, b) => (a.score ?? 1) - (b.score ?? 1),
    );
  };

  return { search, layers, stories };
}
