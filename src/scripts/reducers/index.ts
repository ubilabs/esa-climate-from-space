import languageReducer from "./language";
import layersReducer from "./layers/index";
import storiesReducer from "./story/index";
import globeReducer from "./globe";
import flyToReducer from "./fly-to";
import storyLayerReducer from "./story-layer";
import showLayerSelectorReducer from "./show-layer-selector";
import offlineReducer from "./offline/index";
import downloadedDataReducer from "./downloaded-data";
import welcomeScreenReducer from "./welcome-screen";
import embedElementsReducer from "./embed-elements";
import { layersApi, storiesApi } from "../services/api";

const rootReducer = {
  [layersApi.reducerPath]: layersApi.reducer,
  [storiesApi.reducerPath]: storiesApi.reducer,
  language: languageReducer,
  layers: layersReducer,
  stories: storiesReducer,
  globe: globeReducer,
  flyTo: flyToReducer,
  storyLayerId: storyLayerReducer,
  showLayerSelector: showLayerSelectorReducer,
  offline: offlineReducer,
  downloadedData: downloadedDataReducer,
  welcomeScreen: welcomeScreenReducer,
  embedElements: embedElementsReducer,
};

export default rootReducer;
export type State = any;
