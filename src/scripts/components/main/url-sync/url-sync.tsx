import { FunctionComponent, useEffect } from "react";
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

// syncs the query parameters of the url when values change in store
const UrlSync: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const globeState = useSelector(globeStateSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  const embedElements = useSelector(embedElementsSelector);
  const { mainId, compareId } = useSelector(selectedLayerIdsSelector);

  const globeParamString = getGlobeParamString(globeState, mainId, compareId);
  const tagsParamString = getTagsParamString(selectedTags);
  const embedParamString = getEmbedParamsString(embedElements);
  const embedParamOptions: string[] = uiEmbedElements.reduce<string[]>(
    (accumulator, currentValue) => accumulator.concat(currentValue.elements),
    [],
  );

  // set globe query params in url when globe state changes
  useEffect(() => {
    if (!globeParamString) {
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set("globe", globeParamString);
    navigate({ search: params.toString() }, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeState, mainId, compareId, navigate]); // we don't want to check for location.search changes

  // set story tag query params in url when tags state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (!tagsParamString) {
      params.delete("tags");
    } else {
      params.set("tags", tagsParamString);
    }

    navigate({ search: params.toString() }, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, navigate]); // we don't want to check for location.search changes

  // set embed elements query params in url when state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (!embedParamString) {
      embedParamOptions.forEach((option) => params.delete(option));
    } else {
      const paramsArray = embedParamString
        .split("&")
        .map((key) => key.split("="));

      paramsArray.map((param) => params.set(param[0], param[1]));
    }

    navigate({ search: params.toString() }, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedElements, navigate]); // we don't want to check for location.search changes

  // listen on location updates and re-add query parameters if missing
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    let updated = false;

    const hasEmbedParam = embedParamOptions.some((element) =>
      params.has(element),
    );

    if (tagsParamString && params.get("tags") !== tagsParamString) {
      params.set("tags", tagsParamString);
      updated = true;
    }

    if (globeParamString && !params.has("globe")) {
      params.set("globe", globeParamString);
      updated = true;
    }

    if (embedParamString && !hasEmbedParam) {
      const paramsArray = embedParamString
        .split("&")
        .map((key) => key.split("="));

      paramsArray.forEach(([key, value]) => params.set(key, value));
      updated = true;
    }

    if (updated) {
      navigate({ search: params.toString() }, { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.search,
    tagsParamString,
    globeParamString,
    embedParamString,
    navigate,
  ]);

  return null;
};

export default UrlSync;
