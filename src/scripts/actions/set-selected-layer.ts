export const SET_SELECTED_LAYER_ID = 'SET_SELECTED_LAYER_ID';

export type LayerId = string;

export interface SetSelectedLayerIdAction {
  type: typeof SET_SELECTED_LAYER_ID;
  layerId: LayerId;
}

export const setSelectedLayerIdAction = (
  layerId: LayerId
): SetSelectedLayerIdAction => {
  return {
    type: SET_SELECTED_LAYER_ID,
    layerId
  };
};
