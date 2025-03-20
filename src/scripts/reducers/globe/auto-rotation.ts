
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AutoRotatingPayload {
  isAutoRotating: boolean;
}
const initialState = false


const autoRotateSlice = createSlice({
  name: "flyTo",
  initialState,
  reducers: {
    setIsAutoRotating(state, action: PayloadAction<AutoRotatingPayload>) {
      return action.payload;
    },
  },
});


export const { setIsAutoRotating } = autoRotateSlice.actions;
export default autoRotateSlice.reducer;
