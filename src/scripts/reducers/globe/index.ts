import { combineSlices } from "@reduxjs/toolkit";

import projectionReducer from "./projection";
import viewReducer from "./view";
import timeReducer from "./time";
import spinningReducer from "./spinning";
import layerLoadingStateReducer from "./layer-loading-state";
import renderOptionsReducer from "./render-options";

const globeReducer = combineSlices({
  view: viewReducer,
  projectionState: projectionReducer,
  time: timeReducer,
  spinning: spinningReducer,
  layerLoadingState: layerLoadingStateReducer,
  renderOptions: renderOptionsReducer,
});

export default globeReducer;
