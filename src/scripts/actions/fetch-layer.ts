import {ThunkDispatch} from '../components/main/app/create-redux-store';

import fetchLayerApi from '../api/fetch-layer';

import {Layer} from '../types/layer';

export const FETCH_LAYER_SUCCESS = 'FETCH_LAYER_SUCCESS';
export const FETCH_LAYER_ERROR = 'FETCH_LAYER_ERROR';

export interface FetchLayerSuccessAction {
  type: typeof FETCH_LAYER_SUCCESS;
  id: string;
  layer: Layer;
}

interface FetchLayerErrorAction {
  type: typeof FETCH_LAYER_ERROR;
  id: string;
  message: string;
}

export type FetchLayerActions = FetchLayerSuccessAction | FetchLayerErrorAction;

export function fetchLayerSuccessAction(
  id: string,
  layer: Layer
): FetchLayerSuccessAction {
  return {
    type: FETCH_LAYER_SUCCESS,
    id,
    layer
  };
}

function fetchLayerErrorAction(
  id: string,
  message: string
): FetchLayerErrorAction {
  return {
    type: FETCH_LAYER_ERROR,
    id,
    message
  };
}

const fetchLayer = (id: string) => (dispatch: ThunkDispatch) =>
  fetchLayerApi(id)
    .then(layer => dispatch(fetchLayerSuccessAction(id, layer)))
    .catch(error => dispatch(fetchLayerErrorAction(id, error.message)));

export default fetchLayer;
