import { AppThunkDispatch } from "../components/main/app/create-redux-store";

import fetchLayerApi from "../api/fetch-layer";

import { Layer } from "../types/layer";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../components/main/app/create-redux-store";
import { fetchLayerApi } from "../api/fetch-layer";

export const FETCH_LAYER_SUCCESS = "FETCH_LAYER_SUCCESS";
export const FETCH_LAYER_ERROR = "FETCH_LAYER_ERROR";

export interface FetchLayerSuccessAction {
  type: typeof FETCH_LAYER_SUCCESS;
  id: string;
  layer: Layer;
}

interface FetchLayerErrorAction {
  type: typeof FETCH_LAYER_ERROR;
  id: string;
  message: string;
}

export type FetchLayerActions = FetchLayerSuccessAction | FetchLayerErrorAction;

export function fetchLayerSuccessAction(
  id: string,
  layer: Layer,
): FetchLayerSuccessAction {
  return {
    type: FETCH_LAYER_SUCCESS,
    id,
    layer,
  };
}

function fetchLayerErrorAction(
  id: string,
  message: string,
): FetchLayerErrorAction {
  return {
    type: FETCH_LAYER_ERROR,
    id,
    message,
  };
}

export const fetchLayer = createAsyncThunk(
  "FETCH_LAYER",
  async (id: string, { rejectWithValue }) => {
    try {
      const layer = "";
      return layer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export default fetchLayer;
