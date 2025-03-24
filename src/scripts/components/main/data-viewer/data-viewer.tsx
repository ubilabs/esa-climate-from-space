import { FunctionComponent, useEffect, useRef, useState, useMemo } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import cx from "classnames";

import config, { categoryTags } from "../../../config/main";

import { useContentMarker } from "../../../hooks/use-story-markers";
import { useScreenSize } from "../../../hooks/use-screen-size";

import { useCategoryScrollHandlers } from "../category-navigation/use-category-event-handlers";
import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { setFlyTo } from "../../../reducers/fly-to";

import { languageSelector } from "../../../selectors/language";

import {
  useGetLayerListQuery,
  useGetStoryListQuery,
} from "../../../services/api";
import { useGlobeLocationState } from "../../../hooks/use-location";

import ContentNavigation from "../content-navigation/content-navigation";
import Button from "../button/button";
import { GetDataWidget } from "../data-widget/data-widget";
import CategoryNavigation from "../category-navigation/category-navigation";

import { useContentParams } from "../../../hooks/use-content-params";

import styles from "./data-viewer.module.css";

interface Props {
  hideNavigation?: boolean;
  showCategories?: boolean;
}

interface RouteParams {
  category: string | undefined;
}

export type LayerLoadingStateChangeHandle = (
  layerId: string,
  loadingState: LayerLoadingState,
) => void;

/**
 * DataViewer component responsible for displaying the data view with navigation and globe interaction.
 *
 * @param {Object} props - The component props.
 * @param {string} props.backgroundColor - The background color for the globe.
 * @param {boolean} [props.hideNavigation] - Flag to hide navigation elements.
 * @returns {JSX.Element} The rendered DataViewer component.
 */
const DataViewer: FunctionComponent<Props> = ({
  hideNavigation,
  showCategories,
}) => {
  const { category } = useParams<RouteParams>();
  const language = useSelector(languageSelector);
  const { data: stories } = useGetStoryListQuery(language);

  const { data: layers } = useGetLayerListQuery(language);

  const categoryIndex = category ? categoryTags.indexOf(category) : -1;
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );

  const { handleScroll } = useCategoryScrollHandlers(
    currentCategoryIndex,
    setCurrentCategoryIndex,
  );

  const contents = useMemo(() => [
    ...(stories?.filter(
      (story) => category && story.categories?.includes(category),
    ) ?? []),
    ...(layers?.filter(
      (layer) => category && layer.categories?.includes(category),
    ) ?? []),
  ], [stories, layers, category]);

  const [currentContentIndex, setCurrentContentIndex] = useState<null | number>(
    null,
  );

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    category || null,
  );

  const history = useHistory();
  const intl = useIntl();

  const { screenHeight, screenWidth, isMobile } = useScreenSize();

  // We need to keep track of the current selected content Id because we need to
  // set the flyTo for the marker, or add the data layer to the globe
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null,
  );
  const contentMarker = useContentMarker(selectedContentId, language);

  const { isNavigation, mode } = useContentParams();

  const dispatch = useDispatch();

  // We need to reset the globe view every time the user navigates back from the the /data page
  const { showContentList } = useGlobeLocationState();

  // There is a set of animations which should be played only once
  // This keeps track of that
  // Get state from local storage
  const hasAnimationPlayed = useRef(
    localStorage.getItem(config.localStorageHasUserInteractedKey) === "true",
  );

  useEffect(() => {
    // Don't proceed if there's no selectedContentId or no stories
    if (!selectedContentId || !stories) {
      return;
    }

    const previewedContent = stories.find(
      (story) => story.id === selectedContentId,
    );
    if (
      previewedContent &&
      previewedContent?.position[0] &&
      previewedContent?.position[1]
    ) {
      dispatch(
        setFlyTo({
          isAnimated: true,
          lat: previewedContent.position[1],
          lng: previewedContent.position[0],
        }),
      );
    } else {
      console.warn(
        `Content with id ${selectedContentId} could not be found, ${previewedContent}`,
      );
    }
  }, [selectedContentId, stories, dispatch]);


  const allCategories = stories
    ?.flatMap(({ categories }) => categories)
    .concat(layers?.flatMap(({ categories }) => categories) ?? [])
    .filter(Boolean);

  const uniqueTags = categoryTags;

  // create a list of all tags with their number of occurrences in the stories
  // For now, we filter out tags with less than 3 occurrences as long as we don't have the new categories
  const arcs = useMemo(
    () =>
      uniqueTags.map((tag) => {
        const tags = allCategories ? allCategories : [];
        const count = tags.filter((t) => t === tag).length;
        return { [tag]: count };
      }),
    [uniqueTags, allCategories],
  );
  if (!stories || !layers || !arcs || !contents) {
    return null;
  }

  return (
    // The data-view is a grid with three areas: header - main - footer
    // This is the header area
    <div
      className={styles.dataViewer}
      onWheel={handleScroll}
      data-nav-content={mode}
    >
      {/* This is the main area
        The navigation consists of three main components: the globe, the category navigation and the content navigation
        The globe is the main component and is always visible
        The category navigation is visible when the content navigation is not visible
      */}
      {isNavigation && (
        <>
          {showCategories && (
            <header className={styles.heading}>
              {showContentList ? (
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
          )}
          {!showContentList && showCategories ? (
            <CategoryNavigation
              currentIndex={currentCategoryIndex}
              setCurrentIndex={setCurrentCategoryIndex}
              arcs={arcs}
              showCategories={!showContentList}
              width={screenWidth}
              height={screenHeight}
              isMobile={isMobile}
              setCategory={setCurrentCategory}
              isAnimationReady={hasAnimationPlayed}
            />
          ) : (
            <ContentNavigation
              currentIndex={currentContentIndex}
              setCurrentIndex={setCurrentContentIndex}
              isMobile={isMobile}
              className={styles.contentNav}
              category={currentCategory}
              showContentList={showContentList}
              contents={contents}
              setSelectedContentId={setSelectedContentId}
            />
          )}

          {!showContentList && showCategories ? (
            <>
              <Button
                className={cx(
                  hasAnimationPlayed.current && styles.showFast,
                  styles.exploreButton,
                )}
                onClick={() => {
                  history.push(`/${currentCategory}`);
                }}
                label="explore"
              ></Button>
            </>
          ) : null}
          {!showContentList &&
            showCategories &&
            !hasAnimationPlayed.current && (
              <span
                aria-hidden="true"
                className={cx(
                  styles.swipeIndicator,
                  !isMobile && styles.scroll,
                )}
                data-content={intl.formatMessage({
                  id: `category.${isMobile ? "swipe" : "scroll"}`,
                })}
              ></span>
            )}
          {showContentList && !isMobile && (
            <span className={styles.currentCategory}>
              <FormattedMessage id={`categories.${currentCategory}`} />
            </span>
          )}
        </>
      )}
      <div
        id="globeWrapper"
        className={cx(
          showCategories && styles.globeWrapper,
          showContentList && styles.showContentList,
        )}
      >
        <GetDataWidget
          hideNavigation={Boolean(hideNavigation)}
          showClouds={showCategories && !showContentList}
          className={cx(styles.globe)}
          {...(contentMarker && showContentList &&{
            markers: [contentMarker],
          })}
        />
      </div>
    </div>
  );
};

export default DataViewer;
