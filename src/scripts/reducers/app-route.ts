import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppRoute } from "../types/app-routes";
import { matchPath } from "react-router-dom";
import { ROUTES } from "../config/main";

/**
 * Tries to match a pathname to one of the route patterns
 */
export function matchRoute(pathname: string): AppRoute {
  for (const [key, pattern] of Object.entries(ROUTES) as [
    AppRoute,
    { path: string; end: boolean },
  ][]) {
    if (key === AppRoute.Unknown) continue;

    const match = matchPath(pattern, pathname);
    if (match) return key;
  }

  console.warn("No route match for:", pathname);
  return AppRoute.Unknown;
}

export type AppRouteState = AppRoute;

const initialState: AppRouteState = matchRoute(window.location.pathname);

const AppRouteSlice = createSlice({
  name: "AppRoute",
  initialState,
  reducers: {
    setAppRoute(_state, action: PayloadAction<AppRoute>) {
      return matchRoute(action.payload);
    },
  },
});

export const { setAppRoute } = AppRouteSlice.actions;
export default AppRouteSlice.reducer;
