import {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';

import {useInterval} from '../../../hooks/use-interval';

interface Props {
  autoPlayLink: string;
}

const Autoplay: FunctionComponent<Props> = ({autoPlayLink}) => {
  const history = useHistory();

  useInterval(() => {
    autoPlayLink && history.replace(autoPlayLink);
  }, 3000);

  return null;
};

export default Autoplay;
