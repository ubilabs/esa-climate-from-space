import React, {
  FunctionComponent,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef
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

import styles from './time-slider.styl';

// debounce the time update
const DELAY = 200;

const TimeSlider: FunctionComponent = () => {
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const {mainId, compareId} = selectedLayerIds;
  const dispatch = useDispatch();
  const language = useSelector(languageSelector);
  const globeTime = useSelector(timeSelector);
  const timeOutput = useRef<HTMLDivElement>(null);

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
  const timestampsAvailable = combined.timestamps.length > 0;
  const totalRange = combined.max - combined.min;

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
  if (!timestampsAvailable) {
    return null;
  }

  const getRangeStyle = (
    min: number,
    max: number
  ): {left: string; right: string} => {
    const left = Math.round(((min - combined.min) / totalRange) * 100);
    const right = 100 - Math.round(((max - combined.min) / totalRange) * 100);

    return {
      left: `${left}%`,
      right: `${right}%`
    };
  };

  const setTimeOutput = (targetValue: string, min: number, max: number) => {
    const currentTime = parseInt(targetValue, 10);
    const outputPosition = Number(((currentTime - min) * 100) / (max - min));

    if (timeOutput.current) {
      timeOutput.current.style.left = `calc(${outputPosition}% + (${8 -
        outputPosition * 0.15}px))`;
      timeOutput.current.style.display = 'flex';
    }
  };

  const inputStyles = cx(
    styles.input,
    rangeMain && rangeCompare && styles.compareInput
  );
  const compareStyles = cx(
    styles.compareTrack,
    rangeMain && rangeCompare && styles.compareBothTracks
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
              setTimeOutput(target.value, combined.min, combined.max);
            }}
            min={combined.min}
            max={combined.max}
            step={stepSize}
          />
          <output ref={timeOutput} className={styles.timeOutput}>
            {format(time)}
          </output>
          {rangeMain && (
            <div className={styles.mainTrack}>
              <div
                className={styles.rangeMain}
                style={getRangeStyle(rangeMain.min, rangeMain.max)}>
                {rangeMain.timestamps.map(timestamp => (
                  <div key={timestamp} className={styles.ticks}></div>
                ))}
              </div>
            </div>
          )}
          {rangeCompare && (
            <div className={compareStyles}>
              <div
                className={styles.rangeCompare}
                style={getRangeStyle(rangeCompare.min, rangeCompare.max)}>
                {rangeCompare.timestamps.map(timestamp => (
                  <div key={timestamp} className={styles.ticks}></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
