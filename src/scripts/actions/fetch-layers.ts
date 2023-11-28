import {ThunkDispatch} from '../components/main/app/create-redux-store';

import fetchLayersApi from '../api/fetch-layers';
import {languageSelector} from '../selectors/language';

import {State} from '../reducers/index';
import {LayerList} from '../types/layer-list';

export const FETCH_LAYERS_SUCCESS = 'FETCH_LAYERS_SUCCESS';
export const FETCH_LAYERS_ERROR = 'FETCH_LAYERS_ERROR';

interface FetchLayersSuccessAction {
  type: typeof FETCH_LAYERS_SUCCESS;
  layers: LayerList;
}

interface FetchLayersErrorAction {
  type: typeof FETCH_LAYERS_ERROR;
  message: string;
}

export type FetchLayersActions =
  | FetchLayersSuccessAction
  | FetchLayersErrorAction;

function fetchLayersSuccessAction(layers: LayerList): FetchLayersSuccessAction {
  return {
    type: FETCH_LAYERS_SUCCESS,
    layers
  };
}

function fetchLayersErrorAction(message: string): FetchLayersErrorAction {
  return {
    type: FETCH_LAYERS_ERROR,
    message
  };
}

const fetchLayers = () => (dispatch: ThunkDispatch, getState: () => State) => {
  const language = languageSelector(getState());

  return fetchLayersApi(language)
    .then(layers => dispatch(fetchLayersSuccessAction(layers)))
    .catch(error => dispatch(fetchLayersErrorAction(error.message)));
};

export default fetchLayers;
