import {FunctionComponent} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {timeSelector} from '../../../selectors/globe/time';
import setGlobeTime from '../../../actions/set-globe-time';
import {useInterval} from '../../../hooks/use-interval';

const PLAYBACK_STEP = 1000 * 60 * 60 * 24 * 30; // one month
const PLAYBACK_SPEED = 1000; // increase one step per x milliseconds

interface Props {
  minTime: number;
  maxTime: number;
  speed?: number;
  step?: number;
}

const TimePlayback: FunctionComponent<Props> = ({
  minTime,
  maxTime,
  speed = PLAYBACK_SPEED,
  step = PLAYBACK_STEP
}) => {
  const dispatch = useDispatch();
  const time = useSelector(timeSelector);

  useInterval(() => {
    let newTime = time + step;

    if (newTime > maxTime) {
      newTime = minTime;
    }

    dispatch(setGlobeTime(newTime));
  }, speed);

  return null;
};

export default TimePlayback;
