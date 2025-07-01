import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppRoute } from "../types/app-routes";
import { matchPath } from "react-router-dom";
import { ROUTES } from "../config/main";

/**
 * Tries to match a pathname to one of the route patterns
 */
// Define route order from most specific to most general

export function matchRoute(rawPathname: string): AppRoute {
  // Strip query and hash
  const pathname = rawPathname.split(/[?#]/)[0];

  for (const key of Object.keys(ROUTES)) {
    const route = ROUTES[key as keyof typeof ROUTES];
    const match = matchPath({ path: route.path, end: route.end }, pathname);
    if (match) {
      return key as AppRoute;
    }
  }

  console.warn("No route match for:", pathname);
  return AppRoute.Unknown;
}

export type AppRouteState = AppRoute;

// split the href at the # and pass the second part to matchRoute
const initialState: AppRouteState = matchRoute(
  window.location.href.toString().split("#")[1] || "/",
);

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
