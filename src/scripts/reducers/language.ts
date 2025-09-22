import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getBrowserLanguage from "../libs/get-browser-language";
import getLocalStorageLanguage from "../libs/get-local-storage-language";
import { parseUrl } from "../libs/language-url-parameter";
import { Language } from "../types/language";
import config from "../config/main";

const initialState: Language =
  parseUrl() ||
  getLocalStorageLanguage() ||
  getBrowserLanguage() ||
  Language.EN;

document.documentElement.lang = initialState;

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (_state, action: PayloadAction<Language>) => {
      localStorage.setItem(config.localStorageLanguageKey, action.payload);
      document.documentElement.lang = action.payload;
      return action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
