import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import { useSelector } from "react-redux";
import { languageSelector } from "../../../selectors/language";

export function useSearch() {
  const lang = useSelector(languageSelector);
  type Layer = Record<string, any>;
  type Story = Record<string, any>;
  const [layerFuse, setLayerFuse] = useState<Fuse<Layer> | null>(null);
  const [storyFuse, setStoryFuse] = useState<Fuse<Story> | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetch(`/index/storage-index-${lang}.json.gz`)
      .then((res) => res.json())
      .then((indexData) => {
        // indexData is now { layers: [...], stories: [...] }
        const layersArr: Layer[] = Array.isArray(indexData.layers)
          ? indexData.layers.filter(Boolean)
          : [];
        const storiesArr: Story[] = Array.isArray(indexData.stories)
          ? indexData.stories.filter(Boolean)
          : [];
        setLayers(layersArr);
        setStories(storiesArr);

        if (layersArr.length > 0) {
          const layerKeys = Object.keys(layersArr[0]).filter(
            (k) =>
              typeof layersArr[0][k] === "string" ||
              Array.isArray(layersArr[0][k]),
          );
          setLayerFuse(
            new Fuse(layersArr, {
              keys: layerKeys,
              threshold: 0.3,
            }),
          );
        }

        if (storiesArr.length > 0) {
          const storyKeys = Object.keys(storiesArr[0]).filter(
            (k) =>
              typeof storiesArr[0][k] === "string" ||
              Array.isArray(storiesArr[0][k]),
          );
          setStoryFuse(
            new Fuse(storiesArr, {
              keys: storyKeys,
              threshold: 0.3,
            }),
          );
        }
      });
  }, []);

  const searchLayers = (query: string): Layer[] => {
    if (!layerFuse || !query) return [];
    return layerFuse.search(query).map((r: FuseResult<Layer>) => r.item);
  };

  const searchStories = (query: string): Story[] => {
    if (!storyFuse || !query) return [];
    return storyFuse.search(query).map((r: FuseResult<Story>) => r.item);
  };

  return { searchLayers, searchStories, layers, stories };
}
