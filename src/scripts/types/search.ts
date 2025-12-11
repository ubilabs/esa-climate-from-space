type SearchMetaInfo = {
  id: string;
  categories: string[];
};

export const searchableLayerKeys = [
  "name",
  "shortName",
  "description",
] as const;

export type SearchLayerItem = SearchMetaInfo & {
  [K in (typeof searchableLayerKeys)[number]]: string;
};

export const searchableStoryKeys = [
  "title",
  "subtitle",
  "description",
  "altText",
] as const;

export const searchableStorySlideKeys = [
  "text",
  "shortText",
  "layerDescription",
  "imageCaptions",
  "caption",
  "altText",
] as const;

type SearchStoryFields = {
  [K in (typeof searchableStoryKeys)[number]]: string;
};

type SearchStorySlide = {
  type: string;
} & {
  [K in (typeof searchableStorySlideKeys)[number]]: string;
};

export type SearchStoryItem = SearchMetaInfo &
  SearchStoryFields & {
    slides: Array<SearchStorySlide>;
  };
