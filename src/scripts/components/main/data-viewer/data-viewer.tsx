import { FunctionComponent, useRef, useState, useMemo } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import cx from "classnames";

import { categoryTags } from "../../../config/main";

import { useScreenSize } from "../../../hooks/use-screen-size";
import { useAppRouteFlags } from "../../../hooks/use-app-route-flags";

import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { languageSelector } from "../../../selectors/language";
import { appRouteSelector } from "../../../selectors/route-match";

import {
  useGetLayerListQuery,
  useGetStoryListQuery,
} from "../../../services/api";

import ContentNavigation from "../content-navigation/content-navigation";
import Button from "../button/button";
import { GetDataWidget } from "../data-widget/data-widget";
import CategoryNavigation from "../category-navigation/category-navigation";
import GlobeNavigation from "../globe-navigation/globe-navigation";

import styles from "./data-viewer.module.css";

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
  const { category } = useParams();
  const language = useSelector(languageSelector);
  const { data: stories } = useGetStoryListQuery(language);

  const appRoute = useSelector(appRouteSelector);

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

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    category || null,
  );

  const navigate = useNavigate();
  const intl = useIntl();

  const { screenHeight, screenWidth, isMobile, isTouchDevice } =
    useScreenSize();

  const { isBaseRoute, isNavigationView, isDataRoute, isContentNavRoute } =
    useAppRouteFlags();

  // This keeps track of whether the animation has played
  const hasAnimationPlayed = useRef(false);

  const allCategories = useMemo(
    () =>
      stories
        ?.flatMap(({ categories }) => categories)
        .concat(layers?.flatMap(({ categories }) => categories) ?? [])
        .filter(Boolean),
    [stories, layers],
  );

  // create a list of all tags with their number of occurrences in the stories
  // For now, we filter out tags with less than 3 occurrences as long as we don't have the new categories
  const arcs = useMemo(
    () =>
      categoryTags.map((tag) => {
        const tags = allCategories ? allCategories : [];
        const count = tags.filter((t) => t === tag).length;
        return { [tag]: count };
      }),
    [allCategories],
  );

  if (!stories || !layers || !arcs || !contents) {
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
        <GetDataWidget className={cx(styles.globe)} />
      </div>
      {isDataRoute && <GlobeNavigation />}
      {isNavigationView && (
        <>
          <header className={styles.heading}>
            {isContentNavRoute ? (
              <Button
                label={
                  !isMobile
                    ? "back_to_overview"
                    : `categories.${currentCategory}`
                }
                link={"/"}
                className={styles.backButton}
              ></Button>
            ) : (
              <span className={styles.chooseHeading}>
                <FormattedMessage id="category.choose" />
              </span>
            )}
          </header>
          {isBaseRoute && (
            <>
              <CategoryNavigation
                arcs={arcs}
                width={screenWidth}
                height={screenHeight}
                isMobile={isMobile}
                setCategory={setCurrentCategory}
                isAnimationReady={hasAnimationPlayed}
              />
              <Button
                className={cx(
                  hasAnimationPlayed.current && styles.showFast,
                  styles.exploreButton,
                )}
                onClick={() => {
                  navigate(`/${currentCategory}`);
                }}
                label="explore"
              ></Button>
              {!hasAnimationPlayed.current && (
                <span
                  aria-hidden="true"
                  className={cx(
                    // Make sure to show the gesture indicator depending on whether it is touch screen device
                    styles.gestureIndicator,
                    isTouchDevice ? styles.touch : styles.scroll,
                  )}
                  data-content={intl.formatMessage({
                    id: `category.${isTouchDevice ? "swipe" : "scroll"}`,
                  })}
                ></span>
              )}
            </>
          )}
          {isContentNavRoute && (
            <>
              <ContentNavigation
                isMobile={isMobile}
                className={styles.contentNav}
                category={currentCategory}
                showContentList
                contents={contents}
              />
              {!isMobile && (
                <span className={styles.currentCategory}>
                  <FormattedMessage id={`categories.${currentCategory}`} />
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
