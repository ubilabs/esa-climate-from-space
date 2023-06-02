import {LayerLoadingState} from '@ubilabs/esa-webgl-globe';
import {
  UPDATE_LAYER_LOADING_STATE,
  UpdateLayerLoadingStateAction
} from '../../actions/update-layer-loading-state';

export type LoadingStateByLayer = {[layerId: string]: LayerLoadingState};

function layerLoadingStateReducer(
  state: LoadingStateByLayer = {},
  action: UpdateLayerLoadingStateAction
): LoadingStateByLayer {
  switch (action.type) {
    case UPDATE_LAYER_LOADING_STATE:
      return {...state, [action.layerId]: action.loadingState};
    default:
      return state;
  }
}

export default layerLoadingStateReducer;
