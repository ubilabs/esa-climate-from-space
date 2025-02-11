import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Layer } from "../types/layer";
import type { Story } from "../types/story";
import type { StoryList } from "../types/story-list";
import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";
import { Language } from "../types/language";
import config from "../config/main";
import fetchLayer from "../api/fetch-layer";
import { setLayerDetails } from "../reducers/layers";

async function fetchLayers(language: Language) {
  const url = replaceUrlPlaceholders(config.api.layers, {
    lang: language.toLowerCase(),
  });

  return await fetch(url).then((res) => res.json());
}

export const layersApi = createApi({
  reducerPath: "layersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getLayers: builder.query<Layer[], Language>({
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
      queryFn: async (id: string) => {
        try {
          const data = await fetchLayer(id);
          setLayerDetails(data);
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

async function fetchStory(id: string, lang: Language) {
  const url = replaceUrlPlaceholders(config.api.story, { id, lang });
  return fetch(url).then((res) => res.json());
}
export const storiesApi = createApi({
  reducerPath: "storiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getStories: builder.query<StoryList, Language>({
      query: (lang) => {
        const url = replaceUrlPlaceholders(config.api.stories, { lang });
        return url;
      },
    }),
    getStory: builder.query<Story, { id: string; language: string }>({
      queryFn: async ({ id, language }) => {
        const story = await fetchStory(id, language as Language);
        return { data: story };
      },
    }),
  }),
});

export const { useGetLayersQuery, useGetLayerQuery } = layersApi;

export const { useGetStoriesQuery, useGetStoryQuery } = storiesApi;
