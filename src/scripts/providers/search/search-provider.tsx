import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { languageSelector } from "../../selectors/language";

import {
  SearchContext,
  SearchLayerItem,
  SearchStoryItem,
} from "../../hooks/use-search";

export function SearchProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <SearchContext
      value={{
        layers,
        stories,
      }}
    >
      {children}
    </SearchContext>
  );
}
