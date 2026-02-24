import { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { layerLoadingStateSelector } from "../../../selectors/globe/layer-loading-state";

import { useInterval } from "../../../hooks/use-interval";
import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

const PLAYBACK_STEP = 1000 * 60 * 60 * 24 * 30; // one month
const PLAYBACK_SPEED = 1000; // increase one step per x milliseconds

interface Props {
  time: number;
  setGlobeTime: (time: number) => void;
  minTime: number;
  maxTime: number;
  speed?: number;
  steps?: number[];
  mainLayerId?: string | null;
  compareLayerId?: string | null;
}

const TimePlayback: FunctionComponent<Props> = ({
  time,
  setGlobeTime,
  minTime,
  maxTime,
  speed = PLAYBACK_SPEED,
  steps = [PLAYBACK_STEP],
  mainLayerId,
  compareLayerId,
}) => {
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

    setGlobeTime(nextTime);
  }, [time, nextTime, mainLayerState, compareLayerState, setGlobeTime]);

  return null;
};

export default TimePlayback;
