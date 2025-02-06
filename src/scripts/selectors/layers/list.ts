import { State } from "../../reducers/index";

import { LayerList } from "../../types/layer-list";

export function layersSelector(state: State): LayerList {
  return state.layers.layerList;
}
