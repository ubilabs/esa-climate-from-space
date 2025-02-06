import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

export const UPDATE_LAYER_LOADING_STATE = "UPDATE_LAYER_LOADING_STATE";

export interface UpdateLayerLoadingStateAction {
  type: typeof UPDATE_LAYER_LOADING_STATE;
  layerId: string;
  loadingState: LayerLoadingState;
}

export default function updateLayerLoadingStateAction(
  layerId: string,
  loadingState: LayerLoadingState,
): UpdateLayerLoadingStateAction {
  return { type: UPDATE_LAYER_LOADING_STATE, layerId, loadingState };
}
