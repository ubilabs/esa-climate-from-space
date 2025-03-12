import { FunctionComponent, useEffect, useRef, useState, useMemo } from "react";

import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";

import cx from "classnames";

import config from "../../../config/main";

import { useContentMarker } from "../../../hooks/use-story-markers";
import { useScreenSize } from "../../../hooks/use-screen-size";

import { useCategoryScrollHandlers } from "../category-navigation/use-category-event-handlers";
import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { setFlyTo } from "../../../reducers/fly-to";

import { useGetStoriesQuery } from "../../../services/api";
import { languageSelector } from "../../../selectors/language";
import { globeViewSelector } from "../../../selectors/globe/view";

import ContentNavigation from "../content-navigation/content-navigation";
import Button from "../button/button";
import { GetDataWidget } from "../data-widget/data-widget";
import CategoryNavigation from "../category-navigation/category-navigation";

import styles from "./data-viewer.module.css";

interface Props {
  backgroundColor: string;
  hideNavigation?: boolean;
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
  backgroundColor,
  hideNavigation,
}) => {
  const { category } = useParams<RouteParams>();
  const { handleScroll, currentScrollIndex } = useCategoryScrollHandlers();

  const [showContentList, setShowContentList] = useState<boolean>(
    Boolean(category),
  );

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    category || null,
  );

  const history = useHistory();
  const intl = useIntl();

  const { screenWidth, isMobile } = useScreenSize();

  const language = useSelector(languageSelector);
  const { data: stories } = useGetStoriesQuery(language);
  // We need to keep track of the current selected content Id because we need to
  // set the flyTo for the marker, or add the data layer to the globe
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null,
  );
  const contentMarker = useContentMarker(selectedContentId, language);

  const dispatch = useDispatch();

  // There is a set of animations which should be played only once
  // This keeps track of that
  // Get state from local storage
  const hasAnimationPlayed = useRef(
    localStorage.getItem(config.localStorageHasUserInteractedKey) === "true",
  );

  const globalGlobeView = useSelector(globeViewSelector);

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
          ...globalGlobeView,
          lat: previewedContent.position[1],
          lng: previewedContent.position[0],
        }),
      );
    } else {
      console.warn(
        `Content with id ${selectedContentId} could not be found, ${previewedContent}`,
      );
    }
  }, [selectedContentId, globalGlobeView, stories, dispatch]);

  useEffect(() => {
    if (!showContentList) {
      setSelectedContentId(null);
    }
    setShowContentList(Boolean(category));
  }, [category, showContentList]);

  const allTags = stories?.flatMap(({ tags }) => tags).filter(Boolean);

  const uniqueTags = Array.from(new Set(allTags));

  const contents = stories?.filter(
    (story) => category && story.tags?.includes(category),
  );

  // create a list of all tags with their number of occurrences in the stories
  // For now, we filter out tags with less than 3 occurrences as long as we don't have the new categories
  const arcs = useMemo(
    () =>
      uniqueTags
        .map((tag) => {
          const tags = allTags ? allTags : [];
          const count = tags.filter((t) => t === tag).length;
          return { [tag]: count };
        })
        // Todo: Delete this filter when we have the new categories
        .filter((tag) => Object.values(tag)[0] > 2),
    [uniqueTags, allTags],
  );

  if (!stories || !arcs || !contents) {
    return null;
  }

  return (
    // The data-view is a grid with three areas: header - main - footer
    // This is the header area
    <div
      className={styles.dataViewer}
      onWheel={handleScroll}
      data-content-view={showContentList}
    >
      <header className={styles.heading}>
        {showContentList ? (
          <Button
            label={!isMobile ? "back_to_overview" : `tags.${currentCategory}`}
            link={"/"}
            className={styles.backButton}
          ></Button>
        ) : (
          <FormattedMessage id="category.choose" />
        )}
      </header>

      {/* This is the main area
        The navigation consists of three main components: the globe, the category navigation and the content navigation
        The globe is the main component and is always visible
        The category navigation is visible when the content navigation is not visible
      */}
      {!showContentList ? (
        <CategoryNavigation
          currentScrollIndex={currentScrollIndex}
          arcs={arcs}
          showCategories={!showContentList}
          width={screenWidth}
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
          setSelectedContentId={setSelectedContentId}
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
              history.push(`/${currentCategory}`);
              setShowContentList(!showContentList);
            }}
            label="explore"
          ></Button>
        </>
      ) : null}
      {!showContentList && !hasAnimationPlayed.current && (
        <span
          aria-hidden="true"
          className={cx(styles.swipeIndicator, !isMobile && styles.scroll)}
          data-content={intl.formatMessage({
            id: `category.${isMobile ? "swipe" : "scroll"}`,
          })}
        ></span>
      )}
      {showContentList && !isMobile && (
        <span className={styles.currentCategory}>
          <FormattedMessage id={`tags.${currentCategory}`} />
        </span>
      )}
      <div
        id="globeWrapper"
        className={cx(
          styles.globeWrapper,
          showContentList && styles.showContentList,
        )}
      >
        <GetDataWidget
          hideNavigation={Boolean(hideNavigation)}
          globeProps={{
            ...(contentMarker && {
              markers: [contentMarker],
            }),
            className: cx(styles.globe),
            backgroundColor,
            isAutoRotating: !showContentList,
          }}
        />
      </div>
    </div>
  );
};

export default DataViewer;
