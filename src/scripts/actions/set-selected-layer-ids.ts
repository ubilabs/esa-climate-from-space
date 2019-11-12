export const SET_SELECTED_LAYER_IDS = 'SET_SELECTED_LAYER_IDS';

export interface SetSelectedLayerIdsAction {
  type: typeof SET_SELECTED_LAYER_IDS;
  layerIds: string | null;
  isPrimary: boolean;
}

const setSelectedLayerIdsAction = (
  layerIds: string | null,
  isPrimary: boolean
): SetSelectedLayerIdsAction => ({
  type: SET_SELECTED_LAYER_IDS,
  layerIds,
  isPrimary
});

export default setSelectedLayerIdsAction;
