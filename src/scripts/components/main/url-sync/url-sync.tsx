import {FunctionComponent, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {globeStateSelector} from '../../../selectors/globe/globe-state';
import {selectedTagsSelector} from '../../../selectors/story/selected-tags';
import {getParamString as getGlobeParamString} from '../../../libs/globe-url-parameter';
import {getParamString as getTagsParamString} from '../../../libs/tags-url-parameter';
import {selectedLayerIdsSelector} from '../../../selectors/layers/selected-ids';
import {embedElementsSelector} from '../../../selectors/embed-elements-selector';
import {uiEmbedElements} from '../../../config/main';
import {getDisabledParams} from '../../../libs/get-disabled-params';

// syncs the query parameters of the url when values change in store
const UrlSync: FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const globeState = useSelector(globeStateSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  const embedElements = useSelector(embedElementsSelector);
  const {mainId, compareId} = useSelector(selectedLayerIdsSelector);

  const globeParamString = getGlobeParamString(globeState, mainId, compareId);
  const tagsParamString = getTagsParamString(selectedTags);
  const embedParamString = getDisabledParams(embedElements);
  const embedParamOptions: string[] = uiEmbedElements.reduce<string[]>(
    (accumulator, currentValue) => accumulator.concat(currentValue.elements),
    []
  );

  // set globe query params in url when globe state changes
  useEffect(() => {
    if (!globeParamString) {
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set('globe', globeParamString);
    history.replace({search: params.toString()});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeState, mainId, compareId, history]); // we don't want to check for location.search changes

  // set story tag query params in url when tags state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (!tagsParamString) {
      params.delete('tags');
    } else {
      params.set('tags', tagsParamString);
    }

    history.replace({search: params.toString()});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, history]); // we don't want to check for location.search changes

  // set embed elements query params in url when state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (!embedParamString) {
      embedParamOptions.forEach(option => params.delete(option));
    } else {
      const paramsArray = embedParamString
        .split('&')
        .map(key => key.split('='));

      paramsArray.map(param => params.set(param[0], param[1]));
    }

    history.replace({search: params.toString()});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedElements, history]); // we don't want to check for location.search changes

  // listen on history updates and re-add query parameters if missing
  useEffect(() => {
    const unlisten = history.listen(newLocation => {
      const params = new URLSearchParams(newLocation.search);

      const hasEmbedParam = embedParamOptions.some(element =>
        params.has(element)
      );

      if (tagsParamString && params.get('tags') !== tagsParamString) {
        params.set('tags', tagsParamString);
        history.replace({search: params.toString()});
      }

      if (globeParamString && !params.has('globe')) {
        params.set('globe', globeParamString);
        history.replace({search: params.toString()});
      }

      if (embedParamString && !hasEmbedParam) {
        const paramsArray = embedParamString
          .split('&')
          .map(key => key.split('='));

        paramsArray.map(param => params.set(param[0], param[1]));
        history.replace({search: params.toString()});
      }
    });

    return unlisten;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeParamString, tagsParamString, embedParamString, history]);

  return null;
};

export default UrlSync;
