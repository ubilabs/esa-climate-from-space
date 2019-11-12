import {State} from '../../reducers/index';

import {Layer} from '../../types/layer';

export type DetailsById = {[id: string]: Layer};

export function detailedLayersSelector(state: State): DetailsById {
  return state.layers.details;
}
