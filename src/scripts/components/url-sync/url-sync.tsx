import {FunctionComponent, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {globeStateSelector} from '../../reducers/globe/index';
import {getParamString} from '../../libs/globe-url-parameter';

// syncs the query parameters of the url when values change in store
const UrlSync: FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const globeState = useSelector(globeStateSelector);

  // set globe query params in url when globe state changes
  useEffect(() => {
    const globeValue = getParamString(globeState);

    if (!globeValue) {
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set('globe', globeValue);
    history.replace({search: params.toString()});
  }, [globeState]);

  return null;
};

export default UrlSync;
