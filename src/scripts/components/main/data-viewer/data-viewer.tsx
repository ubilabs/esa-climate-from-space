import { FunctionComponent, useRef, useState, useMemo, useEffect } from "react";

import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import cx from "classnames";

import config, { categoryTags } from "../../../config/main";

import { useScreenSize } from "../../../hooks/use-screen-size";
import { useGlobeLocationState } from "../../../hooks/use-location";
import { useContentParams } from "../../../hooks/use-content-params";

import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { languageSelector } from "../../../selectors/language";
import { embedElementsSelector } from "../../../selectors/embed-elements-selector";

import { toggleEmbedElements } from "../../../reducers/embed-elements";

import { StoryMode } from "../../../types/story-mode";

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

  const { isNavigation, mode } = useContentParams();

  const dispatch = useDispatch();
  const embedElements = useSelector(embedElementsSelector);

  // Enable legend and time slider only in content mode
  useEffect(() => {
    const isContentMode = mode === StoryMode.Content;
    dispatch(
      toggleEmbedElements({
        ...embedElements,
        legend: isContentMode,
        time_slider: isContentMode,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, dispatch]);

  // We need to reset the globe view every time the user navigates back from the the /data page
  const { showContentList, showDataSet } = useGlobeLocationState();

  // There is a set of animations which should be played only once
  // This keeps track of that
  // Get state from local storage
  const hasAnimationPlayed = useRef(
    localStorage.getItem(config.localStorageHasUserInteractedKey) === "true",
  );

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
    <div className={styles.dataViewer} data-nav-content={mode}>
      {/* This is the main area
        The navigation consists of three main components: the globe, the category navigation and the content navigation
        The globe is the main component and is always visible
        The category navigation is visible when the content navigation is not visible
      */}
      {isNavigation && (
        <>
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
          {!showContentList ? (
            <CategoryNavigation
              arcs={arcs}
              width={screenWidth}
              height={screenHeight}
              isMobile={isMobile}
              setCategory={setCurrentCategory}
              isAnimationReady={hasAnimationPlayed}
            />
          ) : (
            <ContentNavigation
              isMobile={isMobile}
              className={styles.contentNav}
              category={currentCategory}
              showContentList={showContentList}
              contents={contents}
            />
          )}

          {!showContentList ? (
            <>
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
            </>
          ) : null}
          {!showContentList && !hasAnimationPlayed.current && (
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
          styles.globeWrapper,
          showContentList && styles.showContentList,
        )}
      >
        <GetDataWidget className={cx(styles.globe)} />
      </div>
      {showDataSet && <GlobeNavigation />}
    </div>
  );
};

export default DataViewer;
