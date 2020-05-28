import {FunctionComponent, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {globeStateSelector} from '../../selectors/globe/globe-state';
import {selectedTagsSelector} from '../../selectors/story/selected-tags';
import {getParamString as getGlobeParamString} from '../../libs/globe-url-parameter';
import {getParamString as getTagsParamString} from '../../libs/tags-url-parameter';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';

// syncs the query parameters of the url when values change in store
const UrlSync: FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const globeState = useSelector(globeStateSelector);
  const selectedTags = useSelector(selectedTagsSelector);
  const {mainId, compareId} = useSelector(selectedLayerIdsSelector);

  const globeParamString = getGlobeParamString(globeState, mainId, compareId);
  const tagsParamString = getTagsParamString(selectedTags);

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

  // listen on history updates and re-add query parameters if missing
  useEffect(() => {
    const unlisten = history.listen(newLocation => {
      const params = new URLSearchParams(newLocation.search);

      if (tagsParamString && params.get('tags') !== tagsParamString) {
        params.set('tags', tagsParamString);
        history.replace({search: params.toString()});
      }

      if (globeParamString && !params.has('globe')) {
        params.set('globe', globeParamString);
        history.replace({search: params.toString()});
      }
    });

    return unlisten;
  }, [globeParamString, tagsParamString, history]);

  return null;
};

export default UrlSync;
