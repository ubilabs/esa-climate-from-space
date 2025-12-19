import { FunctionComponent, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { globeStateSelector } from "../../../selectors/globe/globe-state";
import { selectedTagsSelector } from "../../../selectors/story/selected-tags";
import { getParamString as getGlobeParamString } from "../../../libs/globe-url-parameter";
import { getParamString as getTagsParamString } from "../../../libs/tags-url-parameter";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";
import { uiEmbedElements } from "../../../config/main";
import { getEmbedParamsString } from "../../../libs/get-embed-params-string";

const UrlSync: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const globeState = useSelector(globeStateSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  const embedElements = useSelector(embedElementsSelector);
  const { mainId, compareId } = useSelector(selectedLayerIdsSelector);

  const embedParamOptions = useMemo(
    () =>
      uiEmbedElements.reduce<string[]>(
        (acc, el) => acc.concat(el.elements),
        [],
      ),
    [],
  );

  const targetSearch = useMemo(() => {
    const params = new URLSearchParams();

    const globeParam = getGlobeParamString(globeState, mainId, compareId);
    if (globeParam) params.set("globe", globeParam);

    const tagsParam = getTagsParamString(selectedTags);
    if (tagsParam) params.set("tags", tagsParam);

    const embedParam = getEmbedParamsString(embedElements);

    if (embedParam) {
      embedParam.split("&").forEach((kv) => {
        const [key, value] = kv.split("=");
        if (key && value) params.set(key, value);
      });
    }

    return params.toString();
  }, [globeState, mainId, compareId, selectedTags, embedElements]);

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    console.log("🚀 ~ url-sync.tsx:54 → location:", location);
    console.log(
      "🚀 ~ url-sync.tsx:54 → currentParams:",
      currentParams.get("searchQuery"),
    );
    const targetParams = new URLSearchParams(targetSearch);

    const searchParam = currentParams.get("searchQuery") ?? null;

    if (searchParam) {
      targetParams.set("searchQuery", searchParam);
    }

    let hasChanges = false;

    // compare keys
    for (const [key, value] of targetParams.entries()) {
      if (currentParams.get(key) !== value) {
        hasChanges = true;
        break;
      }
    }

    // check for stale keys that should be removed
    if (!hasChanges) {
      for (const key of currentParams.keys()) {
        if (
          !targetParams.has(key) &&
          (key === "globe" || key === "tags" || embedParamOptions.includes(key))
        ) {
          hasChanges = true;
          break;
        }
      }
    }

    if (hasChanges) {
      console.log("🚀 ~ url-sync.tsx:96 → targetSearch:", targetSearch);
      navigate(
        { search: targetParams.toString() },
        { replace: false, state: location.state },
      );
    }
  }, [
    targetSearch,
    location.search,
    location.state,
    navigate,
    embedParamOptions,
  ]);

  return null;
};

export default UrlSync;
