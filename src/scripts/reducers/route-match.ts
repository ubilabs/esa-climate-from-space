import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RouteMatch } from "../types/story-mode";
import { matchPath } from "react-router-dom";
import { ROUTES } from "../config/main";

/**
 * Tries to match a pathname to one of the route patterns
 */
export function matchRoute(pathname: string): RouteMatch {
  for (const [key, pattern] of Object.entries(ROUTES) as [
    RouteMatch,
    { path: string; end: boolean },
  ][]) {
    if (key === RouteMatch.Unknown) continue;

    const match = matchPath(pattern, pathname);
    if (match) return key;
  }

  console.warn("No route match for:", pathname);
  return RouteMatch.Unknown;
}

export interface RouteMatchState {
  routeMatch: RouteMatch;
}

const initialState: RouteMatchState = {
  routeMatch: matchRoute(window.location.pathname),
};

const RouteMatchSlice = createSlice({
  name: "routeMatch",
  initialState,
  reducers: {
    setRouteMatch(state, action: PayloadAction<string>) {
      console.log("Setting route match for:", action.payload);
      console.log("Current route match:", matchRoute(action.payload));
      state.routeMatch = matchRoute(action.payload);
    },
  },
});

export const { setRouteMatch } = RouteMatchSlice.actions;
export default RouteMatchSlice.reducer;
