import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { timeSelector } from "../../../selectors/globe/time";
import { layerLoadingStateSelector } from "../../../selectors/globe/layer-loading-state";

import { useInterval } from "../../../hooks/use-interval";
import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";
import { setGlobeTime } from "../../../reducers/globe/time";

const PLAYBACK_STEP = 1000 * 60 * 60 * 24 * 30; // one month
const PLAYBACK_SPEED = 1000; // increase one step per x milliseconds

interface Props {
  minTime: number;
  maxTime: number;
  speed?: number;
  steps?: number[];
  mainLayerId?: string | null;
  compareLayerId?: string | null;
}

const TimePlayback: FunctionComponent<Props> = ({
  minTime,
  maxTime,
  speed = PLAYBACK_SPEED,
  steps = [PLAYBACK_STEP],
  mainLayerId,
  compareLayerId,
}) => {
  const dispatch = useDispatch();
  const time = useSelector(timeSelector);

  const [nextTime, setNextTime] = useState(time);
  const [stepIndex, setStepIndex] = useState(() => {
    const index = steps.findIndex((step) => step >= time);
    return index === -1 ? 0 : index;
  });

  useInterval(() => {
    let newTime = 0;

    // if multiple steps are defined, use them to increase playback.
    if (steps.length > 1) {
      newTime = steps[stepIndex];

      if (stepIndex < steps.length) {
        setStepIndex((prev) => prev + 1);
      } else {
        setStepIndex(0);
        newTime = minTime;
      }
      // if not, reuse single step for an evenly increasing playback.
    } else {
      newTime = time + steps[0];

      if (newTime > maxTime) {
        newTime = minTime;
      }
    }

    // don't immediately set the new time, since we might have to wait
    // for the layer to complete loading the previous timestamp.
    setNextTime(newTime);
  }, speed);

  // before the globe-time is updated, make sure the layers have actually
  // rendered the current time.

  // get the state for both possible layers. When no layer is specified, we
  //   use 'idle' as to not interfere with the loading logic
  const layerLoadingState = useSelector(layerLoadingStateSelector);
  const mainLayerState = mainLayerId
    ? layerLoadingState[mainLayerId]
    : ("idle" as LayerLoadingState);
  const compareLayerState = compareLayerId
    ? layerLoadingState[compareLayerId]
    : ("idle" as LayerLoadingState);

  useEffect(() => {
    if (
      nextTime === time ||
      mainLayerState === "loading" ||
      compareLayerState === "loading"
    ) {
      return;
    }

    dispatch(setGlobeTime(nextTime));
  }, [dispatch, time, nextTime, mainLayerState, compareLayerState]);

  return null;
};

export default TimePlayback;
