import React, {
  FunctionComponent,
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedDate} from 'react-intl';
import debounce from 'lodash.debounce';
import cx from 'classnames';

import {languageSelector} from '../../../selectors/language';
import {timeSelector} from '../../../selectors/globe/time';
import {layerDetailsSelector} from '../../../selectors/layers/layer-details';
import setGlobeTime from '../../../actions/set-globe-time';
import {getTimeRanges} from '../../../libs/get-time-ranges';
import {State} from '../../../reducers';
import {selectedLayerIdsSelector} from '../../../selectors/layers/selected-ids';
import {getLayerTimeIndex} from '../../../libs/get-image-layer-data';
import TimeSliderRange from '../time-slider-range/time-slider-range';
import TimePlayback from '../time-playback/time-playback';
import Button from '../../main/button/button';
import {PlayCircleIcon} from '../../main/icons/play-circle-icon';
import {PauseCircleIcon} from '../../main/icons/pause-circle-icon';

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
  const [isPlaying, setIsPlaying] = useState(false);
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

  // update app state
  const debouncedSetGlobeTime = useCallback(
    debounce((newTime: number) => dispatch(setGlobeTime(newTime)), DELAY, {
      maxWait: DELAY
    }),
    []
  );

  // sync local time
  useEffect(() => {
    if (time !== globeTime) {
      setTime(globeTime);
    }
  }, [time, globeTime]);

  // return nothing when no timesteps available
  if (combined.timestamps.length === 0) {
    return null;
  }

  const labelPosition = Number(
    ((time - combined.min) * 100) / (combined.max - combined.min)
  );
  const clampedLabelPosition = Math.max(Math.min(labelPosition, 100), 0);

  const inputStyles = cx(
    styles.input,
    rangeMain && rangeCompare && styles.compareInput
  );

  return (
    <div className={styles.timeSlider}>
      {isPlaying && (
        <TimePlayback minTime={combined.min} maxTime={combined.max} />
      )}
      <div className={styles.container}>
        <Button
          className={cx(
            styles.playButton,
            rangeCompare && styles.playButtonCompare
          )}
          icon={isPlaying ? PauseCircleIcon : PlayCircleIcon}
          onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'playing' : 'pausing'}
        </Button>
        <div className={styles.ranges}>
          <input
            className={inputStyles}
            type="range"
            value={time}
            onChange={({target}) => {
              const newTime = parseInt(target.value, 10);
              setTime(newTime);
              debouncedSetGlobeTime(newTime);
              setIsPlaying(false);
            }}
            min={combined.min}
            max={combined.max}
            step={stepSize}
          />

          {rangeMain && (
            <output
              className={cx(
                styles.timeOutput,
                rangeCompare && styles.timeOutputMain
              )}
              style={{
                left: `${clampedLabelPosition}%`
              }}>
              {timeSelectedMain ? format(timeSelectedMain) : false}
            </output>
          )}

          {rangeCompare && (
            <output
              className={cx(styles.timeOutput, styles.timeOutputCompare)}
              style={{
                left: `${clampedLabelPosition}%`
              }}>
              {timeSelectedCompare ? format(timeSelectedCompare) : false}
            </output>
          )}

          {rangeMain && (
            <TimeSliderRange
              range={rangeMain}
              combined={combined}
              selectedTimeIndex={timeIndexMain}
            />
          )}

          <div className={styles.yearLabel}>
            <div>
              <FormattedDate value={combined.min} year="numeric" />
            </div>
            <div>
              <FormattedDate value={combined.max} year="numeric" />
            </div>
          </div>

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
