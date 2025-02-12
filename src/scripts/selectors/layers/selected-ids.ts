import { State } from "../../reducers/index";
import { SelectedLayerIdsState } from "../../reducers/layers";

export function selectedLayerIdsSelector(state: State): SelectedLayerIdsState {
  return state.layers.layerIds;
}
