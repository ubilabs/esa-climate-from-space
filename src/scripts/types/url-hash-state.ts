import { GlobeState } from "../reducers/globe/globe-state";

export interface UrlHashState {
  globeState: GlobeState;
  layerIds: {
    mainId: string | null;
    compareId: string | null;
  };
}
