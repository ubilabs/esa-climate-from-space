import {State} from '../../reducers/index';
import {LoadingStateByLayer} from '../../reducers/globe/layer-loading-state';

export function layerLoadingStateSelector(state: State): LoadingStateByLayer {
  return state.globe.layerLoadingState;
}
