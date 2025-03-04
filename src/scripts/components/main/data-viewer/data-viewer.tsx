import { useHistory, useParams } from "react-router-dom";
import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useGetStoriesQuery } from "../../../services/api";
import { languageSelector } from "../../../selectors/language";

import ContentNavigation from "../content-navigation/content-navigation";
import Button from "../button/button";
import CategoryNavigation, {
  HAS_USER_INTERACTED,
} from "../category-navigation/category-navigation";

import { setSelectedTags } from "../../../reducers/story";

import { useScreenSize } from "../../../hooks/use-screen-size";

import cx from "classnames";

import { GetDataWidget } from "../data-widget/data-widget";
import { useDispatch } from "react-redux";
import { setFlyTo } from "../../../reducers/fly-to";

import styles from "./data-viewer.module.css";
import { useContentMarker } from "../../../hooks/use-story-markers";
import { FormattedMessage, useIntl } from "react-intl";
import { useCategoryScrollHandlers } from "../category-navigation/use-category-event-handlers";

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

  const { screenHeight, screenWidth, isMobile } = useScreenSize();

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
    !isMobile || localStorage.getItem(HAS_USER_INTERACTED) === "true",
  );
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't proceed if there's no selectedContentId or no stories
    if (!selectedContentId || !stories) {
      return;
    }

    const previewedContent = stories.find(
      (story) => story.id === selectedContentId,
    );

    if (!previewedContent) {
      console.warn(`Content with id ${selectedContentId} could not be found`);
      return;
    }

    dispatch(
      setFlyTo({
        lat: previewedContent.position[1],
        lng: previewedContent.position[0],
        isAnimated: true,
      }),
    );
  }, [selectedContentId, stories, dispatch]);

  useEffect(() => {
    if (!showContentList) {
      setSelectedContentId(null);
    }
    setShowContentList(Boolean(category));
  }, [category, showContentList]);

  if (!stories) {
    return null;
  }

  const allTags: string[] = stories.flatMap(({ tags }) => tags).filter(Boolean);

  const uniqueTags = Array.from(new Set(allTags));

  const contents = stories.filter(
    (story) => category && story.tags?.includes(category),
  );

  // create a list of all tags with their number of occurrences in the stories
  // For now, we filter out tags with less than 3 occurrences as long as we don't have the new categories
  const arcs = uniqueTags
    .map((tag) => {
      const count = allTags.filter((t) => t === tag).length;
      return { [tag]: count };
    })
    // Todo: Delete this filter when we have the new categories
    .filter((arc) => Object.values(arc)[0] > 2);
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
          onSelect={(category) => setSelectedTags([category])}
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
      {!showContentList && (
        <span
          aria-hidden="true"
          className={cx(styles.swipeIndicator, !isMobile && styles.scroll)}
          data-content={intl.formatMessage({
            id: `category.${isMobile ? "swipe" : "scroll"}`,
          })}
        ></span>
      )}
      {showContentList && !isMobile && <span className={styles.currentCategory}>{currentCategory}</span>}
      <div
        id="globeWrapper"
        className={cx(
          styles.globeWrapper,
          showContentList && styles.showContentList,
        )}
      >
      </div>
    </div>
  );
};

export default DataViewer;
