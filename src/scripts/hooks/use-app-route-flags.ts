import { useSelector } from "react-redux";
import { appRouteSelector } from "../selectors/route-match";
import { AppRoute } from "../types/app-routes";

export function useAppRouteFlags() {
  const appRoute = useSelector(appRouteSelector);

  // the "navigation view" consists of the category (rendered at the base path) as well as the content navigation
  const isNavigationView =
    appRoute === AppRoute.Base || appRoute === AppRoute.NavContent;

  const isShowCaseView =
    appRoute === AppRoute.Showcase ||
    appRoute === AppRoute.ShowcaseStory ||
    appRoute === AppRoute.ShowcaseStories;

  const isShowCaseStoryRoute = appRoute === AppRoute.ShowcaseStory;

  const isPresentView =
    appRoute === AppRoute.Present || appRoute === AppRoute.PresentStory;

  const isPresentStoryRoute = appRoute === AppRoute.PresentStory;

  const isContentNavRoute = appRoute === AppRoute.NavContent;

  const isStoriesRoute =
    appRoute === AppRoute.Stories || appRoute === AppRoute.LegacyStory;

  const isDataRoute = appRoute === AppRoute.Data;

  const isBaseRoute = appRoute === AppRoute.Base;

  return {
    isPresentStoryRoute,
    isShowCaseStoryRoute,
    isContentNavRoute,
    isStoriesRoute,
    isBaseRoute,
    isNavigationView,
    isDataRoute,
    isShowCaseView,
    isPresentView,
  };
}
