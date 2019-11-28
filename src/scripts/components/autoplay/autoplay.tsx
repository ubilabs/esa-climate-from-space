import {FunctionComponent} from 'react';
import {useInterval} from '../../hooks/use-interval';
import {useHistory} from 'react-router-dom';

interface Props {
  autoPlayLink: string | null;
}

const Autoplay: FunctionComponent<Props> = ({autoPlayLink}) => {
  const history = useHistory();

  useInterval(() => {
    history.replace(`${autoPlayLink}`);
  }, 5000);

  return null;
};

export default Autoplay;
