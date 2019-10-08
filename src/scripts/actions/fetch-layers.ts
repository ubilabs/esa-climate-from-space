import {Dispatch} from 'redux';

import fetchLayersApi from '../api/fetch-layers';
import {localeSelector} from '../reducers/locale';
import {State} from '../reducers/index';

export const FETCH_LAYERS_SUCCESS = 'FETCH_LAYERS_SUCCESS';
export const FETCH_LAYERS_ERROR = 'FETCH_LAYERS_ERROR';

export interface Layer {
  id: string;
  name: string;
  description: string;
  metadataUrl: string;
  subLayers: Layer[];
}

interface FetchLayersSuccessAction {
  type: typeof FETCH_LAYERS_SUCCESS;
  layers: Layer[];
}

interface FetchLayersErrorAction {
  type: typeof FETCH_LAYERS_ERROR;
  message: string;
}

export type FetchLayersActions =
  | FetchLayersSuccessAction
  | FetchLayersErrorAction;

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

const fetchLayers = () => (dispatch: Dispatch, getState: () => State) => {
  const locale = localeSelector(getState());

  return fetchLayersApi(locale)
    .then(layers => dispatch(fetchLayersSuccessAction(layers)))
    .catch(error => dispatch(fetchLayersErrorAction(error.message)));
};

export default fetchLayers;
