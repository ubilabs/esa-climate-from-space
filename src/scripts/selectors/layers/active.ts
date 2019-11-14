import {State} from '../../reducers/index';

export function activeLayersSelector(
  state: State,
  props: {[key: string]: string} | null
) {
  const {mainLayerId, compareLayerId} = props || {};

  return {
    mainLayerDetails:
      (mainLayerId && state.layers.details[mainLayerId]) || null,
    compareLayerDetails:
      (compareLayerId && state.layers.details[compareLayerId]) || null
  };
}
