import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseUrl } from "../../libs/globe-url-parameter";
import { Layer } from "../../types/layer";

export type DetailsById = { [id: string]: Layer };
export interface SelectedLayerIdsState {
  mainId: string | null;
  compareId: string | null;
}
interface LayersState {
  details: DetailsById;
  layerIds: SelectedLayerIdsState;
}

const initialState: LayersState = {
  details: {},
  layerIds: parseUrl()?.layerIds || { mainId: null, compareId: null },
};

const layersSlice = createSlice({
  name: "layers",
  initialState,
  reducers: {
    setLayerDetails: (state, action: PayloadAction<Layer>) => {
      state.details[action.payload.id] = action.payload;
    },
    setSelectedLayerIds: (
      state,
      action: PayloadAction<{ layerId: string | null; isPrimary: boolean }>,
    ) => {
      const key = action.payload.isPrimary ? "mainId" : "compareId";
      state.layerIds[key] = action.payload.layerId;
    },
  },
});

export const { setLayerDetails, setSelectedLayerIds } = layersSlice.actions;

export default layersSlice.reducer;
export type { LayersState };
