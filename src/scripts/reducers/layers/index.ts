import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LayerList } from "../../types/layer-list";
import { DetailsById } from "./details";
import { parseUrl } from "../../libs/globe-url-parameter";

export interface SelectedLayerIdsState {
  mainId: string | null;
  compareId: string | null;
}
interface LayersState {
  layerList: LayerList;
  details: DetailsById;
  layerIds: SelectedLayerIdsState;
}

const initialState: LayersState = {
  layerList: [],
  details: {},
  layerIds: parseUrl()?.layerIds || { mainId: null, compareId: null },
};

const layersSlice = createSlice({
  name: "layers",
  initialState,
  reducers: {
    setLayerList: (state, action: PayloadAction<LayerList>) => {
      state.layerList = action.payload.map((layer) => ({ ...layer }));
    },
    setLayerDetails: (state, action: PayloadAction<DetailsById>) => {
      state.details = { ...action.payload };
    },
    setSelectedLayerIds: (
      state,
      action: PayloadAction<{ layerId: string | null; isPrimary: boolean }>,
    ) => {
      const newState = { ...state };

      const key = action.payload.isPrimary ? "mainId" : "compareId";
      newState[key] = action.payload.layerId;
      return newState;
    },
  },
});

export const { setLayerList, setLayerDetails, setSelectedLayerIds } =
  layersSlice.actions;

export default layersSlice.reducer;
export type { LayersState };
