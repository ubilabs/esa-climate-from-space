import {
  FETCH_LAYER_SUCCESS,
  FetchLayerSuccessAction
} from '../../actions/fetch-layer';

import config from '../../config/main';

import {Layer} from '../../types/layer';

export type DetailsById = {[id: string]: Layer};

function detailsReducer(
  state: DetailsById = {},
  action: FetchLayerSuccessAction
): DetailsById {
  switch (action.type) {
    case FETCH_LAYER_SUCCESS:
      if (action.id === 'land_cover.lccs_class') {
        return {
          ...state,
          [action.id]: {
            ...action.layer,
            hoverLegend: config.landCoverLegendValues
          }
        };
      }
      return {
        ...state,
        [action.id]: action.layer
      };
    default:
      return state;
  }
}

export default detailsReducer;
