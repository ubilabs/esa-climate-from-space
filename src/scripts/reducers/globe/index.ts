import { combineSlices } from "@reduxjs/toolkit";

import projectionReducer from "./projection";
import viewReducer from "./view";
import timeReducer from "./time";
import spinningReducer from "./spinning";
import layerLoadingStateReducer from "./layer-loading-state";
import autoRotationReducer from "./auto-rotation";

const globeReducer = combineSlices({
  view: viewReducer,
  projectionState: projectionReducer,
  time: timeReducer,
  spinning: spinningReducer,
  layerLoadingState: layerLoadingStateReducer,
  isAutoRotationEnabled: autoRotationReducer,
});

export default globeReducer;
