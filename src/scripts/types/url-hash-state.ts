import { GlobeState } from "../reducers/globe/index";

export interface UrlHashState {
  globeState: GlobeState;
  layerIds: {
    mainId: string | null;
    compareId: string | null;
  };
}
