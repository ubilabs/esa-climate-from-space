import {Dispatch} from 'redux';
import config from '../config/main';

export const FETCH_LAYERS_SUCCESS = 'FETCH_LAYERS_SUCCESS';
export const FETCH_LAYERS_ERROR = 'FETCH_LAYERS_ERROR';

export interface Layer {
  id: string;
  name: string;
  description: string;
  metadataUrl: string;
  subLayer: Layer[];
}

export interface FetchLayersSuccessAction {
  type: typeof FETCH_LAYERS_SUCCESS;
  layers: Layer[];
}

export interface FetchLayersErrorAction {
  type: typeof FETCH_LAYERS_ERROR;
  message: string;
}

function fetchLayersSuccessAction(layers: Layer[]) {
  return {
    type: FETCH_LAYERS_SUCCESS,
    layers
  };
}

function fetchLayersErrorAction(message: string) {
  return {
    type: FETCH_LAYERS_ERROR,
    message
  };
}

const fetchLayers = () => (dispatch: Dispatch) => {
  return fetch(config.api.layers)
    .then(res => res.json())
    .then(layers => dispatch(fetchLayersSuccessAction(layers)))
    .catch(error => dispatch(fetchLayersErrorAction(error.message)));
};

export default fetchLayers;
