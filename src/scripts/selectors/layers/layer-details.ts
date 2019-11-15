import {State} from '../../reducers/index';

export function layerDetailsSelector(
  state: State,
  props: {mainLayerId?: string; compareLayerId?: string} | null
) {
  const {mainLayerId, compareLayerId} = props || {};

  return {
    mainLayerDetails:
      (mainLayerId && state.layers.details[mainLayerId]) || null,
    compareLayerDetails:
      (compareLayerId && state.layers.details[compareLayerId]) || null
  };
}
