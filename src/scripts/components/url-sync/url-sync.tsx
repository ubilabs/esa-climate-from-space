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

  // set globe query params in url when globe state changes
  useEffect(() => {
    const globeValue = getGlobeParamString(globeState, mainId, compareId);

    if (!globeValue) {
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set('globe', globeValue);
    history.replace({search: params.toString()});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeState, mainId, compareId, history]); // we don't want to check for location.search changes

  // set story tag query params in url when tags state changes
  useEffect(() => {
    const tagsValue = getTagsParamString(selectedTags);
    const params = new URLSearchParams(location.search);

    if (!tagsValue) {
      params.delete('tags');
    } else {
      params.set('tags', tagsValue);
    }

    history.replace({search: params.toString()});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, history]); // we don't want to check for location.search changes

  return null;
};

export default UrlSync;
