import React, {
  FunctionComponent,
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import debounce from 'lodash.debounce';
import cx from 'classnames';

import {languageSelector} from '../../selectors/language';
import {timeSelector} from '../../selectors/globe/time';
import {layerDetailsSelector} from '../../selectors/layers/layer-details';
import setGlobeTime from '../../actions/set-globe-time';
import {getTimeRanges} from '../../libs/get-time-ranges';
import {State} from '../../reducers';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';
import {getLayerTimeIndex} from '../../libs/get-layer-tile-url';
import TimeSliderRange from '../time-slider-range/time-slider-range';

import styles from './time-slider.styl';

// debounce the time update
const DELAY = 200;

// eslint-disable-next-line complexity
const TimeSlider: FunctionComponent = () => {
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const {mainId, compareId} = selectedLayerIds;
  const dispatch = useDispatch();
  const language = useSelector(languageSelector);
  const globeTime = useSelector(timeSelector);
  const [time, setTime] = useState(globeTime);
  const stepSize = 1000 * 60 * 60 * 24; // one day
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareId)
  );

  // date format
  const mainDateFormat = mainLayerDetails?.timeFormat;
  const {format} = useMemo(
    () => new Intl.DateTimeFormat(language, mainDateFormat || {}),
    [language, mainDateFormat]
  );

  // ranges
  const {main: rangeMain, compare: rangeCompare, combined} = useMemo(
    () => getTimeRanges(mainLayerDetails, compareLayerDetails),
    [mainLayerDetails, compareLayerDetails]
  );
  const timeIndexMain = useMemo(
    () => getLayerTimeIndex(time, rangeMain?.timestamps || []),
    [time, rangeMain]
  );
  const timeIndexCompare = useMemo(
    () => getLayerTimeIndex(time, rangeCompare?.timestamps || []),
    [time, rangeCompare]
  );
  const timeSelectedMain =
    rangeMain && new Date(rangeMain.timestamps[timeIndexMain]);
  const timeSelectedCompare =
    rangeCompare && new Date(rangeCompare.timestamps[timeIndexCompare]);

  // get the label time - the tick time which is closest to the slider's time
  const timeDiffMain = Math.abs(Number(timeSelectedMain) - time);
  const timeDiffCompare = Math.abs(Number(timeSelectedCompare) - time);
  const labelTime =
    typeof timeDiffCompare === 'number' && timeDiffCompare < timeDiffMain
      ? timeSelectedCompare
      : timeSelectedMain;

  // update app state
  const debouncedSetGlobeTime = useCallback(
    debounce((newTime: number) => dispatch(setGlobeTime(newTime)), DELAY, {
      maxWait: DELAY
    }),
    []
  );

  // clamp time according to min/max
  useEffect(() => {
    if (time < combined.min) {
      setTime(combined.min);
    }

    if (time > combined.max) {
      setTime(combined.max);
    }
  }, [time, combined.min, combined.max]);

  // return nothing when no timesteps available
  if (combined.timestamps.length === 0) {
    return null;
  }

  const labelPosition = Number(
    ((time - combined.min) * 100) / (combined.max - combined.min)
  );

  const inputStyles = cx(
    styles.input,
    rangeMain && rangeCompare && styles.compareInput
  );

  return (
    <div className={styles.timeSlider}>
      <div className={styles.container}>
        <div className={styles.ranges}>
          <input
            className={inputStyles}
            type="range"
            value={time}
            onChange={({target}) => {
              const newTime = parseInt(target.value, 10);
              setTime(newTime);
              debouncedSetGlobeTime(newTime);
            }}
            min={combined.min}
            max={combined.max}
            step={stepSize}
          />

          <output
            className={styles.timeOutput}
            style={{
              left: `${labelPosition}%`
            }}>
            {labelTime ? format(labelTime) : false}
          </output>

          {rangeMain && (
            <TimeSliderRange
              range={rangeMain}
              combined={combined}
              selectedTimeIndex={timeIndexMain}
            />
          )}

          {rangeCompare && (
            <TimeSliderRange
              range={rangeCompare}
              combined={combined}
              selectedTimeIndex={timeIndexCompare}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
