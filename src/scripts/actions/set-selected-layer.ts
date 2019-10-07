export const SET_SELECTED_LAYER_ID = 'SET_SELECTED_LAYER_ID';

export type LayerId = string | null;

export interface SetSelectedLayerIdAction {
  type: typeof SET_SELECTED_LAYER_ID;
  layerId: LayerId;
  isPrimary: boolean;
}

export const setSelectedLayerIdAction = (
  layerId: LayerId,
  isPrimary: boolean
): SetSelectedLayerIdAction => ({
  type: SET_SELECTED_LAYER_ID,
  layerId,
  isPrimary
});
