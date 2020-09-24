import {FunctionComponent} from 'react';
import {useHistory} from 'react-router-dom';

import {useInterval} from '../../../hooks/use-interval';

interface Props {
  autoPlayLink: string;
  delay: number;
}

const Autoplay: FunctionComponent<Props> = ({autoPlayLink, delay}) => {
  const history = useHistory();

  useInterval(() => {
    autoPlayLink && history.replace(autoPlayLink);
  }, delay);

  return null;
};

export default Autoplay;
