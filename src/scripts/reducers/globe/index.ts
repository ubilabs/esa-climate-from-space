import { combineSlices } from "@reduxjs/toolkit";

import projectionReducer from "./projection";
import viewReducer from "./view";
import timeReducer from "./time";
import spinningReducer from "./spinning";
import layerLoadingStateReducer from "./layer-loading-state";
import renderOptionsReducer from "./render-options";
import multiGlobeSyncReducer from "./multi-globe-sync";

const globeReducer = combineSlices({
  view: viewReducer,
  projectionState: projectionReducer,
  time: timeReducer,
  spinning: spinningReducer,
  layerLoadingState: layerLoadingStateReducer,
  renderOptions: renderOptionsReducer,
  multiGlobeSync: multiGlobeSyncReducer,
});

export default globeReducer;
