import {State} from '../../reducers/index';
import {selectedLayerIdsSelector} from './selected-ids';

export function activeLayersSelector(state: State) {
  const {main: mainId, compare: compareId} = selectedLayerIdsSelector(state);

  return {
    main: (mainId && state.layers.details[mainId]) || null,
    compare: (compareId && state.layers.details[compareId]) || null
  };
}
