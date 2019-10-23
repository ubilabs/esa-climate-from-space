import {
  FETCH_LAYER_SUCCESS,
  FetchLayerSuccessAction
} from '../../actions/fetch-layer';

import {State} from '../index';
import {Layer} from '../../types/layer';

export type DetailsById = {[id: string]: Layer};

function detailsReducer(
  state: DetailsById = {},
  action: FetchLayerSuccessAction
): DetailsById {
  switch (action.type) {
    case FETCH_LAYER_SUCCESS:
      return {
        ...state,
        [action.id]: action.layer
      };
    default:
      return state;
  }
}

export function detailedLayersSelector(state: State): DetailsById {
  return state.layers.details;
}

export default detailsReducer;
