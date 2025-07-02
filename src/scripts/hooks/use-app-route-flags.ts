import { useSelector } from "react-redux";
import { appRouteSelector } from "../selectors/route-match";
import { AppRoute } from "../types/app-routes";

export function useAppRouteFlags() {
  const appRoute = useSelector(appRouteSelector);

  // the "navigation view" consists of the category (rendered at the base path) as well as the content navigation
  const isNavigationView =
    appRoute === AppRoute.Base || appRoute === AppRoute.NavContent;

  const isContentNavRoute = appRoute === AppRoute.NavContent;

  const isStoriesRoute =
    appRoute === AppRoute.Stories || appRoute === AppRoute.LegacyStory;

  const isDataRoute = appRoute === AppRoute.Data;

  const isShowCaseRoute = appRoute === AppRoute.Showcase;
  const isBaseRoute = appRoute === AppRoute.Base;

  return {
    isContentNavRoute,
    isStoriesRoute,
    isBaseRoute,
    isNavigationView,
    isDataRoute,
    isShowCaseRoute,
  };
}
