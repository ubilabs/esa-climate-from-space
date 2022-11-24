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

import {timeSelector} from '../../../selectors/globe/time';
import {layerDetailsSelector} from '../../../selectors/layers/layer-details';
import setGlobeTime from '../../../actions/set-globe-time';
import {State} from '../../../reducers';
import {selectedLayerIdsSelector} from '../../../selectors/layers/selected-ids';
import getPlaybackStep from '../../../libs/get-playback-step';
import clampToRange from '../../../libs/clamp-to-range';
import TimeSliderRange from '../time-slider-range/time-slider-range';
import TimePlayback from '../time-playback/time-playback';
import Button from '../../main/button/button';
import {PlayCircleIcon} from '../../main/icons/play-circle-icon';
import {PauseCircleIcon} from '../../main/icons/pause-circle-icon';
import setGlobeSpinningAction from '../../../actions/set-globe-spinning';
import {globeSpinningSelector} from '../../../selectors/globe/spinning';
import {useLayerTimes} from '../../../hooks/use-formatted-time';

import styles from './time-slider.styl';

interface Props {
  className?: string;
  noTimeClamp?: boolean;
}

// debounce the time update
const DELAY = 200;

// eslint-disable-next-line complexity
const TimeSlider: FunctionComponent<Props> = ({
  className = '',
  noTimeClamp
}) => {
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const {mainId, compareId} = selectedLayerIds;
  const dispatch = useDispatch();
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
  const globeSpinning = useSelector(globeSpinningSelector);

  const playbackStep = useMemo(
    () => Math.floor(getPlaybackStep(mainLayerDetails, compareLayerDetails)),
    [mainLayerDetails, compareLayerDetails]
  );
  const {
    mainTimeFormat,
    compareTimeFormat,
    rangeMain,
    rangeCompare,
    combined,
    timeIndexMain,
    timeIndexCompare
  } = useLayerTimes();

  const clampedTime = clampToRange(time, combined.min, combined.max);

  // update app state
  const debouncedSetGlobeTime = useCallback(
    debounce((newTime: number) => dispatch(setGlobeTime(newTime)), DELAY, {
      maxWait: DELAY
    }),
    []
  );

  // clamp globe time to min/max of the active layers when a layer changes
  // dont clamp in story mode where time is set by slide
  useEffect(() => {
    if (!noTimeClamp && clampedTime !== time) {
      dispatch(setGlobeTime(clampedTime));
    }
  }, [noTimeClamp, clampedTime, time, dispatch]);

  // stop playback when layer changes
  useEffect(() => {
    setIsPlaying(false);
  }, [mainLayerDetails, compareLayerDetails]);

  // sync local time
  useEffect(() => {
    if (time !== globeTime) {
      setTime(globeTime);
    }
  }, [time, globeTime]);

  // stop globe spinning when playing
  useEffect(() => {
    if (isPlaying && globeSpinning) {
      dispatch(setGlobeSpinningAction(false));
    }
  }, [dispatch, isPlaying, globeSpinning]);

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
    rangeMain && rangeCompare && styles.compareInput,
    !rangeMain && rangeCompare && styles.singleInput
  );
  const classes = cx(styles.timeSlider, className);

  return (
    <div className={classes}>
      {isPlaying && (
        <TimePlayback
          minTime={combined.min}
          maxTime={combined.max}
          step={playbackStep}
        />
      )}
      <div className={styles.container}>
        <Button
          className={cx(
            styles.playButton,
            rangeCompare && styles.playButtonCompare
          )}
          icon={isPlaying ? PauseCircleIcon : PlayCircleIcon}
          onClick={() => setIsPlaying(!isPlaying)}
        />
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
              {mainTimeFormat}
            </output>
          )}

          {rangeCompare && (
            <output
              className={cx(
                styles.timeOutput,
                styles.timeOutputCompare,
                !rangeMain && rangeCompare && styles.singleOutput
              )}
              style={{
                left: `${clampedLabelPosition}%`
              }}>
              {compareTimeFormat}
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
