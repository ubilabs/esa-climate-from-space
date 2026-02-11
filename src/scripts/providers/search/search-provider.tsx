import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { languageSelector } from "../../selectors/language";
import { SearchContext } from "../../hooks/use-search";

import config from "../../config/main";
import { SearchLayerItem, SearchStoryItem } from "../../types/search";

import { replaceUrlPlaceholders } from "../../libs/replace-url-placeholders";

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const lang = useSelector(languageSelector);

  const [layers, setLayers] = useState<SearchLayerItem[]>([]);
  const [stories, setStories] = useState<SearchStoryItem[]>([]);

  useEffect(() => {
    fetch(replaceUrlPlaceholders(config.api.searchIndex, { lang }))
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
    <SearchContext.Provider
      value={{
        layers,
        stories,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
