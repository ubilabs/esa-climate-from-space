import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import fetchLayer from "../api/fetch-layer";
import fetchStory from "../api/fetch-story";

import config from "../config/main";

import { convertLegacyStory } from "../libs/convert-legacy-story";
import { isLegacyStory } from "../libs/is-legacy-story";
import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";

import { setLayerDetails } from "../reducers/layers";

import { Language } from "../types/language";
import type { Layer } from "../types/layer";
import { LayerList } from "../types/layer-list";
import { LegacyStory } from "../types/legacy-story";
import type { LegacyStoryType, Story } from "../types/story";
import type { StoryList } from "../types/story-list";
import { fetchLayers } from "../api/fetch-layers";

// In this file, we create an API slice for managing layer and story data using Redux Toolkit Query.
// In combination with Redux Toolkit allows us to fetch data
// from the server and store it in the Redux store. We can then use auto-generated hooks (e.g. useGetLayerListQuery)
// to get access to the data, loading state, and error state without writing any reducers or actions manually.

/**
 * Creates an API slice for managing layer data using Redux Toolkit Query.
 *
 */
export const layersApi = createApi({
  reducerPath: "layersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getLayerList: builder.query<LayerList, Language>({
      queryFn: async (language: Language) => {
        try {
          const data = await fetchLayers(language);
          return { data };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
    }),
    getLayer: builder.query<Layer, string>({
      queryFn: async (id: string, { dispatch }) => {
        try {
          const data = await fetchLayer(id);
          dispatch(setLayerDetails(data));
          return { data };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
    }),
  }),
});

const fetchAndConvertStory = async (id: string, language: Language) => {
  const rawData = await fetchStory(id, language as Language);
  const data = isLegacyStory(rawData)
    ? convertLegacyStory(rawData as LegacyStory)
    : (rawData as LegacyStoryType);
  return data;
};

/**
 * Redux API slice for managing story-related API endpoints.
 */
export const storiesApi = createApi({
  reducerPath: "storiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getStoryList: builder.query<StoryList, Language>({
      query: (lang) => {
        const url = replaceUrlPlaceholders(config.api.stories, { lang });
        return url;
      },
    }),
    getStory: builder.query<Story, { id: string; language: string }>({
      queryFn: async ({ id, language }) => {
        try {
          const data = await fetchStory(id, language as Language);
          return { data };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
    }),

    // Fetch legacy stories. Still in use in LegacyStory.tsx
    getLegacyStory: builder.query<
      LegacyStory,
      { id: string; language: string }
    >({
      queryFn: async ({ id, language }) => {
        try {
          const data = await fetchAndConvertStory(id, language as Language);
          return { data };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
    }),
    getStories: builder.query<
      LegacyStory[],
      { ids: string[]; language: string }
    >({
      queryFn: async ({ ids, language }) => {
        try {
          const data = await Promise.all(
            ids.map((id) => fetchAndConvertStory(id, language as Language)),
          );
          return { data };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetLayerListQuery, useGetLayerQuery } = layersApi;

export const {
  useGetStoriesQuery,
  useGetStoryListQuery,
  useGetLegacyStoryQuery,
  useGetStoryQuery,
} = storiesApi;
