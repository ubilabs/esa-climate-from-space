import { CameraView } from "@ubilabs/esa-webgl-globe";
import { GlobeProjectionState } from "../../types/globe-projection-state";
import { LoadingStateByLayer } from "./layer-loading-state";
import { GlobeRenderOptions } from "./render-options";

export interface GlobeState {
  view: CameraView;
  projectionState: GlobeProjectionState;
  time: number;
  spinning: boolean;
  layerLoadingState: LoadingStateByLayer;
  renderOptions?: GlobeRenderOptions;
  multiGlobeSync?: boolean;
}
