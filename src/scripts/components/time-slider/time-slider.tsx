import React, {FunctionComponent, useState, useMemo, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {selectedLayersSelector} from '../../reducers/layers/selected';
import {detailedLayersSelector} from '../../reducers/layers/details';

import styles from './time-slider.styl';

const TimeSlider: FunctionComponent = () => {
  const [time, setTime] = useState(0);
  const stepSize = 1000 * 60 * 60 * 24; // one day
  const selectedLayers = useSelector(selectedLayersSelector);
  const detailedLayers = useSelector(detailedLayersSelector);

  // get only active layer ids
  const activeLayers = useMemo(
    () => Object.values(selectedLayers).filter(Boolean),
    [selectedLayers]
  );

  // get combined and sorted timestamps from all active layers
  const allTimestamps = useMemo(
    () =>
      activeLayers
        .map(id => detailedLayers[id])
        .filter(Boolean)
        .map(({timestamps}) => timestamps)
        // @ts-ignore
        .flat()
        .map((isoString: string) => Number(new Date(isoString)))
        .sort((a: number, b: number) => a - b),
    [activeLayers, detailedLayers]
  );

  const min = allTimestamps[0];
  const max = allTimestamps[allTimestamps.length - 1];
  const timestampsAvailable = allTimestamps.length > 0;

  // clamp time according to min/max
  useEffect(() => {
    if (time < min) {
      setTime(min);
    }

    if (time > max) {
      setTime(max);
    }
  }, [time, min, max]);

  // return nothing when no timesteps available
  if (!timestampsAvailable) {
    return null;
  }

  return (
    <div className={styles.timeSlider}>
      <div className={styles.label}>
        {new Date(time).toISOString().substr(0, 10)}
      </div>

      <input
        className={styles.input}
        type="range"
        value={time}
        onChange={({target}) => setTime(parseInt(target.value, 10))}
        min={min}
        max={max}
        step={stepSize}
      />
    </div>
  );
};

export default TimeSlider;
