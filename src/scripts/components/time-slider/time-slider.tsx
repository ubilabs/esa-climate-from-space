import React, {
  FunctionComponent,
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import debounce from 'lodash.debounce';

import {selectedLayersSelector} from '../../reducers/layers/selected';
import {detailedLayersSelector} from '../../reducers/layers/details';
import setGlobeTime from '../../actions/set-globe-time';

import styles from './time-slider.styl';

const DELAY = 200;

const TimeSlider: FunctionComponent = () => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(0);
  const stepSize = 1000 * 60 * 60 * 24; // one day
  const selectedLayers = useSelector(selectedLayersSelector);
  const detailedLayers = useSelector(detailedLayersSelector);
  const debouncedSetGlobeTime = useCallback(
    debounce((newTime: number) => dispatch(setGlobeTime(newTime)), DELAY, {
      maxWait: DELAY
    }),
    []
  );

  // get only active layers
  const activeLayers = useMemo(
    () =>
      Object.values(selectedLayers)
        .filter(Boolean)
        .map(id => detailedLayers[id])
        .filter(Boolean),
    [selectedLayers, detailedLayers]
  );

  const timestampsPerLayer = useMemo(
    () => activeLayers.map(({timestamps}) => timestamps),
    [activeLayers]
  );

  // get combined and sorted timestamps from all active layers
  const combinedTimestamps = useMemo(
    () =>
      timestampsPerLayer
        // @ts-ignore
        .flat()
        .map((isoString: string) => Number(new Date(isoString)))
        .sort((a: number, b: number) => a - b),
    [timestampsPerLayer]
  );

  const min = combinedTimestamps[0];
  const max = combinedTimestamps[combinedTimestamps.length - 1];
  const timestampsAvailable = combinedTimestamps.length > 0;

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
        onChange={({target}) => {
          const newTime = parseInt(target.value, 10);
          setTime(newTime);
          debouncedSetGlobeTime(newTime);
        }}
        min={min}
        max={max}
        step={stepSize}
      />
    </div>
  );
};

export default TimeSlider;

// eslint-disable-next-line complexity
function getTimestamps(selectedLayers, detailedLayers) {
  const mainLayer = selectedLayers.main && detailedLayers[selectedLayers.main];
  const compareLayer =
    selectedLayers.compare && detailedLayers[selectedLayers.compare];

  const main = (mainLayer && getTimeRange(mainLayer.timestamps)) || null;
  const compare =
    (compareLayer && getTimeRange(compareLayer.timestamps)) || null;

  const combined = getTimeRange([
    ...((main && main.timestamps) || []),
    ...((compare && compare.timestamps) || [])
  ]);

  return {
    main,
    compare,
    combined
  };
}

function getTimeRange(timestamps: string[]) {
  const sorted = timestamps
    .map((isoString: string) => new Date(isoString))
    .sort((a: Date, b: Date) => Number(a) - Number(b));

  return {
    min: sorted[0].toISOString(),
    max: sorted[sorted.length - 1].toISOString(),
    timestamps: sorted.map(date => date.toISOString())
  };
}
