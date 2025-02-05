export const SET_SELECTED_LAYER_ID = "SET_SELECTED_LAYER_ID";

export interface SetSelectedLayerIdAction {
  type: typeof SET_SELECTED_LAYER_ID;
  layerId: string | null;
  isPrimary: boolean;
}

const setSelectedLayerIdAction = (
  layerId: string | null,
  isPrimary: boolean,
): SetSelectedLayerIdAction => ({
  type: SET_SELECTED_LAYER_ID,
  layerId,
  isPrimary,
});

export default setSelectedLayerIdAction;
