import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getBrowserLanguage from "../libs/get-browser-language";
import getLocalStorageLanguage from "../libs/get-local-storage-language";
import { parseUrl } from "../libs/language-url-parameter";
import { Language } from "../types/language";

const initialState: Language =
  parseUrl() ||
  getLocalStorageLanguage() ||
  getBrowserLanguage() ||
  Language.EN;

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      return action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
