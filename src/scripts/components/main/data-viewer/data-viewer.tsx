import { FunctionComponent, useMemo } from "react";

import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";

import cx from "classnames";

import { useScreenInfo } from "../../../hooks/use-screen-info";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { languageSelector } from "../../../selectors/language";
import { appRouteSelector } from "../../../selectors/route-match";

import {
  useGetLayerListQuery,
  useGetStoryListQuery,
} from "../../../services/api";

import ContentNavigation from "../content-navigation/content-navigation";
import CategoryNavigation from "../category-navigation/category-navigation";
import GlobeNavigation from "../globe-navigation/globe-navigation";
import { GetGlobalDataWidget } from "../data-widget/global-data-widget";

import { BackButton } from "../back-button/back-button";

import styles from "./data-viewer.module.css";
import { useRegisterUserInteraction } from "../../../hooks/use-register-user-interaction";
import InitialSplash from "../initial-splash/initial-splash";
import { useContentParams } from "../../../hooks/use-content-params";

export type LayerLoadingStateChangeHandle = (
  layerId: string,
  loadingState: LayerLoadingState,
) => void;

/**
 * DataViewer component responsible for displaying the data view with navigation and globe interaction.
 *
 * @param {Object} props - The component props.
 * @param {string} props.backgroundColor - The background color for the globe.
 * @returns {JSX.Element} The rendered DataViewer component.
 */
const DataViewer: FunctionComponent = () => {
  const language = useSelector(languageSelector);
  const { data: stories } = useGetStoryListQuery(language);

  const appRoute = useSelector(appRouteSelector);

  const { category } = useContentParams();
  console.log("🚀 ~ data-viewer.tsx:56 → category:", category);

  const { data: layers } = useGetLayerListQuery(language);

  const contents = useMemo(
    () => [
      ...(stories?.filter(
        (story) => category && story.categories?.includes(category),
      ) ?? []),
      ...(layers?.filter(
        (layer) => category && layer.categories?.includes(category),
      ) ?? []),
    ],
    [stories, layers, category],
  );

  // const [currentCategory, setCurrentCategory] = useState<string | null>(
  //   category || null,
  // );

  const { isMobile } = useScreenInfo();

  const { isBaseRoute, isNavigationView, isDataRoute, isContentNavRoute } =
    useAppRouteFlags();

  const hasUserInteracted = useRegisterUserInteraction();

  if (!stories || !layers || !contents) {
    return null;
  }

  return (
    // The data-view is a grid with three areas: header - main - footer
    // This is the header area
    <div className={styles.dataViewer} data-nav-content={appRoute}>
      {/* This is the main area
        The navigation consists of three main components: the globe, the category navigation and the content navigation
        The globe is the main component and is always visible
        The category navigation is visible when the content navigation is not visible
      */}
      <div
        id="globeWrapper"
        className={cx(
          styles.globeWrapper,
          isContentNavRoute && styles.showContentList,
        )}
      >
        <GetGlobalDataWidget className={cx(styles.globe)} />
      </div>
      {isDataRoute && <GlobeNavigation />}
      {isNavigationView && (
        <>
          <header className={styles.heading}>
            {isContentNavRoute && (
              <BackButton
                label={
                  !isMobile ? "back_to_overview" : `categories.${category}`
                }
                link="/"
              ></BackButton>
            )}
          </header>
          {isBaseRoute && (
            <>
              {hasUserInteracted ? <CategoryNavigation /> : <InitialSplash />}
            </>
          )}
          {isContentNavRoute && (
            <>
              <ContentNavigation
                isMobile={isMobile}
                className={styles.contentNav}
                showContentList
                contents={contents}
              />
              {!isMobile && (
                <span className={styles.currentCategory}>
                  <FormattedMessage id={`categories.${category}`} />
                </span>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DataViewer;
