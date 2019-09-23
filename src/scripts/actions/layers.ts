export const ADD_LAYERS = 'ADD_LAYERS';

export interface AddLayersAction {
  type: typeof ADD_LAYERS;
  layers: number[];
}

function addLayersActionCreator(layers: number[]) {
  return {
    type: ADD_LAYERS,
    layers
  };
}

export default addLayersActionCreator;
