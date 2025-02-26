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
import { debounce } from "../../../libs/debounce";
import { useContentMarker } from "../../../hooks/use-story-markers";
import { FormattedMessage } from "react-intl";

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

  const [showContentList, setShowContentList] = useState<boolean>(
    Boolean(category),
  );

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    category || null,
  );
  console.log(
    "🚀 ~ file: data-viewer.tsx ~ line 202 ~ DataViewer ~ currentCategory",
    currentCategory,
  );
  const history = useHistory();

  const { screenWidth } = useScreenSize();

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
    localStorage.getItem(HAS_USER_INTERACTED) === "true",
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

    debounce(
      () => {
        dispatch(
          setFlyTo({
            lat: previewedContent.position[1],
            lng: previewedContent.position[0],
            isAnimated: true,
          }),
        );
      },
      100,
      debounceTimeout,
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
    <div className={styles.dataViewer}>
      <header className={styles.heading}>
        {showContentList ? (
          <Button
            label={
              `tags.${currentCategory}`
            }
            link={'/'}
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
      <CategoryNavigation
        onSelect={(category) => setSelectedTags([category])}
        arcs={arcs}
        showCategories={!showContentList}
        width={screenWidth}
        setCategory={setCurrentCategory}
        isAnimationReady={hasAnimationPlayed}
      />

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
      <span
        aria-hidden="true"
        className={styles.swipeIndicator}
        style={{ display: hasAnimationPlayed.current ? "none" : "block" }}
        data-content="swipe to navigate"
      ></span>

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
            className: cx(!showContentList && styles.globe),
            backgroundColor,
            isAutoRoating: !showContentList,
          }}
        />
      </div>

      <ContentNavigation
        category={currentCategory}
        showContentList={showContentList}
        contents={contents}
        setSelectedContentId={setSelectedContentId}
      />
    </div>
  );
};

export default DataViewer;
