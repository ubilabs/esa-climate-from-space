import { useSelector } from "react-redux";
import { appRouteSelector } from "../selectors/route-match";
import { AppRoute } from "../types/app-routes";

export function useAppPath() {
  const { appRoute } = useSelector(appRouteSelector);

  // the "navigation view" consists of the category (rendered at the base path) as well as the content navigation
  const isNavigationView =
    appRoute === AppRoute.Base || appRoute === AppRoute.NavContent;

  const isContentNavRoute = appRoute === AppRoute.NavContent;

  const isStoriesPath =
    appRoute === AppRoute.Stories || appRoute === AppRoute.LegacyStory;

  const isDataPath = appRoute === AppRoute.Data;

  const isShowCasePath = appRoute === AppRoute.Showcase;
  const isBasePath = appRoute === AppRoute.Base;

  return {
    isContentNavRoute,
    isStoriesPath,
    isBasePath,
    isNavigationView,
    isDataPath,
    isShowCasePath,
  };
}
