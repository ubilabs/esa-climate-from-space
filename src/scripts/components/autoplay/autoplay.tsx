import {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';

import {useInterval} from '../../hooks/use-interval';
import {useStoryNavigation} from '../../hooks/use-story-navigation';

const Autoplay: FunctionComponent = () => {
  const storyNavigation = useStoryNavigation();
  const {autoPlayLink} = storyNavigation;
  const history = useHistory();

  useInterval(() => {
    history.replace(`${autoPlayLink}`);
  }, 3000);

  return null;
};

export default Autoplay;
