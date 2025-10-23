import { combineReducers } from "@reduxjs/toolkit";

import { layersApi, storiesApi } from "../services/api";

import downloadedDataReducer from "./downloaded-data";
import embedElementsReducer from "./embed-elements";
import flyToReducer from "./fly-to";
import globeReducer from "./globe";
import languageReducer from "./language";
import layersReducer from "./layers/index";
import offlineReducer from "./offline/index";
import showLayerSelectorReducer from "./show-layer-selector";
import storyLayerReducer from "./story-layer";
import storiesReducer from "./story/index";
import contentReducer from "./content/index";
import welcomeScreenReducer from "./welcome-screen";
import appRouteReducer from "./app-route";

const rootReducer = combineReducers({
  // We dynamically fetch information about layers and stories using RTK Query.
  // The API slices contain only data fetched from the server, and no state.
  [layersApi.reducerPath]: layersApi.reducer,
  [storiesApi.reducerPath]: storiesApi.reducer,
  // The reducers below contain the state of the application.
  // They are not created by RTK Query or contain any data fetched from somewhere else.
  appRoute: appRouteReducer,
  content: contentReducer,
  layers: layersReducer,
  stories: storiesReducer,
  language: languageReducer,
  globe: globeReducer,
  flyTo: flyToReducer,
  storyLayerId: storyLayerReducer,
  showLayerSelector: showLayerSelectorReducer,
  offline: offlineReducer,
  downloadedData: downloadedDataReducer,
  welcomeScreen: welcomeScreenReducer,
  embedElements: embedElementsReducer,
});

export default rootReducer;
export type State = ReturnType<typeof rootReducer>;
