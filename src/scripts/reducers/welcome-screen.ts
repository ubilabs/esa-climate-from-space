import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getLocalStorageWelcomePage from "../libs/get-local-storage-welcome";

const initialState: boolean = getLocalStorageWelcomePage() || false;

const welcomeScreenSlice = createSlice({
  name: "welcomeScreen",
  initialState,
  reducers: {
    setWelcomeScreen(_state, action: PayloadAction<boolean>) {
      return action.payload;
    },
  },
});

export const { setWelcomeScreen } = welcomeScreenSlice.actions;
export default welcomeScreenSlice.reducer;
