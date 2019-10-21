import {Dispatch} from 'redux';

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
  message: string;
}

export type FetchLayerActions = FetchLayerSuccessAction | FetchLayerErrorAction;

function fetchLayerSuccessAction(id: string, layer: Layer) {
  return {
    type: FETCH_LAYER_SUCCESS,
    id,
    layer
  };
}

function fetchLayerErrorAction(message: string) {
  return {
    type: FETCH_LAYER_ERROR,
    message
  };
}

const fetchLayer = (id: string) => (dispatch: Dispatch) =>
  fetchLayerApi(id)
    .then(layer => dispatch(fetchLayerSuccessAction(id, layer)))
    .catch(error => dispatch(fetchLayerErrorAction(error.message)));

export default fetchLayer;
