import { createContext, use } from "react";
import Fuse from "fuse.js";
import type { FuseResult, FuseResultMatch } from "fuse.js";

import removeMarkdown from "remove-markdown";

import { getStoryMediaType } from "../libs/get-story-media-type";

import {
  searchableLayerKeys,
  searchableStorySlideKeys,
  searchableStoryKeys,
  SearchLayerItem,
  SearchStoryItem,
} from "../types/search";

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

/**
 * Filters search matches to prioritize "perfect matches" where the matched
 * substring exactly equals the search query (case-insensitive).
 *
 * For each match, if there are any perfect matches found, only those perfect
 * matches are kept. Otherwise, all original matches are preserved.
 *
 * @param matches - The array of Fuse.js match results to filter
 * @param query - The search query string to compare against
 * @returns The filtered array of matches with perfect matches prioritized, or undefined if no matches provided
 *
 * @example
 * // If query is "ocean" and a match contains both "ocean" and "oceanic"
 * // Only the "ocean" match will be kept in the indices
 */
function filterMatchesToPerfect(
  matches: readonly FuseResultMatch[] | undefined,
  query: string,
): FuseResultMatch[] | undefined {
  if (!matches) return undefined;

  const lowerQuery = query.toLowerCase();

  return matches.map((match) => {
    const { value, indices } = match;

    if (!value || !indices) return match;

    // Identify "perfect matches" — substring exactly equal to query
    const perfectMatches = indices.filter(([start, end]) => {
      const substr = value.slice(start, end + 1);
      return substr.toLowerCase() === lowerQuery;
    });

    // If there is at least one perfect match, keep only those
    if (perfectMatches.length > 0) {
      return {
        ...match,
        indices: perfectMatches,
      };
    }

    // Otherwise, keep all original matches
    return match;
  });
}

export function useSearch() {
  const context = use(SearchContext);

  return (query: string): SearchResult[] => {
    if (!query) return [];

    const { layers, stories } = context ?? { layers: [], stories: [] };

    const layerSearcher =
      layers.length > 0
        ? new Fuse(
            layers.map((layer) => ({
              ...layer,
              description: removeMarkdown(layer.description ?? ""),
            })),
            {
              keys: [...searchableLayerKeys],
              ...fuseConfig,
              minMatchCharLength: query.length,
            },
          )
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
                ...searchableStoryKeys,
                ...searchableStorySlideKeys.map((key) => `slides.${key}`),
              ],
              ...fuseConfig,
              minMatchCharLength: query.length,
            },
          )
        : null;

    const layerResults: SearchResult[] = layerSearcher
      ? layerSearcher.search(query).map((result) => ({
          ...result,
          type: "layer" as const,
          matches: filterMatchesToPerfect(result.matches, query),
        }))
      : [];

    const storyResults: SearchResult[] = storySearcher
      ? storySearcher.search(query).map((result) => ({
          ...result,
          type: getStoryMediaType(result.item, stories),
          matches: filterMatchesToPerfect(result.matches, query),
        }))
      : [];

    // Combine and sort by score (lower is better)
    return [...layerResults, ...storyResults].sort(
      (a, b) => (a.score ?? 1) - (b.score ?? 1),
    );
  };
}
