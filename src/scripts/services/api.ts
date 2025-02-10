import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Layer } from "../types/layer";
import type { Story } from "../types/story";
import type { StoryList } from "../types/story-list";
import { replaceUrlPlaceholders } from "../libs/replace-url-placeholders";
import { Language } from "../types/language";
import config from "../config/main";
export default async function fetchLayers(language: Language) {
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
      queryFn: async (language) => {
        try {
          const data = await fetchLayers(language);
          return { data };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
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
