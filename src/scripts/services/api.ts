import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Layer } from "../types/layer";
import type { Story } from "../types/story";
import type { StoryList } from "../types/story-list";
import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";
import { Language } from "../types/language";
import config from "../config/main";
export const layersApi = createApi({
  reducerPath: "layersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getLayers: builder.query<Layer[], void>({
      query: () => "layers",
    }),
    getLayer: builder.query<Layer, string>({
      query: (id) => `layer/${id}`,
    }),
  }),
});

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
      query: ({ id, language }) => `stories/${id}?lang=${language}`,
    }),
  }),
});

export const { useGetLayersQuery, useGetLayerQuery } = layersApi;

export const { useGetStoriesQuery, useGetStoryQuery } = storiesApi;
