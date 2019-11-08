import {State} from '../../reducers/index';
import {LayersState} from '../../reducers/layers/index';

export const layersStateSelector = (state: State): LayersState => state.layers;
