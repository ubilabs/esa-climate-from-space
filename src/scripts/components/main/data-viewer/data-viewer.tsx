import { useHistory, useParams } from "react-router-dom";

import { LayerLoadingState, RenderMode } from "@ubilabs/esa-webgl-globe";

import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useGetStoriesQuery } from "../../../services/api";
import { languageSelector } from "../../../selectors/language";

import ContentNavigation from "../content-navigation/content-navigation";
import Button from "../button/button";
import CategoryNavigation, { HAS_USER_INTERACTED } from "../category-navigation/category-navigation";

import { setSelectedTags } from "../../../reducers/story";

import { useScreenSize } from "../../../hooks/use-screen-size";

import cx from "classnames";

import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { State } from "../../../reducers";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { GetDataWidget } from "../data-widget/data-widget";
import { useStoryMarkers } from "../../../hooks/use-story-markers";
import { useDispatch } from "react-redux";
import { setFlyTo } from "../../../reducers/fly-to";
import { setGlobeView } from "../../../reducers/globe/view";

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

  const [showContentList, setShowContentList] = useState<boolean>(
    Boolean(category),
  );

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    category || null,
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

  const dispatch = useDispatch();

  const markers = useStoryMarkers()
    .filter((story) => story.tags.includes(currentCategory))
    .filter((story) => {
      if (selectedContentId && showContentList) {
        return story.id === selectedContentId;
      } else {
        return story;
      }
    });
  // There is a set of animations which should be played only once
  // This keeps track of that
  // Get state from local storage
  const hasAnimationPlayed = useRef(localStorage.getItem(HAS_USER_INTERACTED) === 'true');

  useEffect(() => {
    const previewedContent = stories?.find(
      (story) => story.id === selectedContentId,
    );

    if (!previewedContent) {
      console.warn("Content could not be found");
      return;
    }


    dispatch(
      setFlyTo({
        lat: previewedContent?.position[1] || 0,
        // On mobile, we only show the right 32% of the globe, so here
        // adapt the lng position to make sure the marker is actually seen
        lng: previewedContent?.position[0] - 0 || 0,
        isAnimated: true,
      }),
    );
  }, [selectedContentId, stories, dispatch]);

  useEffect(() => {
    if (!showContentList) {
      setSelectedContentId(null);
    }
    setShowContentList(Boolean(category));
  }, [category]);

  if (!stories) {
    return null;
  }

  const allTags: string[] = stories.flatMap(({ tags }) => tags).filter(Boolean);

  const uniqueTags = Array.from(new Set(allTags));

  const contents = stories.filter(
    (story) => category && story.tags?.includes(category),
  );

  console.log("markers", markers);
  // create a list of all tags with their number of occurrences in the stories
  // For now, we filter out tags with less than 3 occurrences as long as we don't have the new categories

  // const markers = stories.filter
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
          <Button link="/" label="" className={styles.backArrow}></Button>
        ) : null}
        <h2>{showContentList ? currentCategory : "Choose a category"}</h2>
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
            label="Explore"
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
          markers={markers}
          hideNavigation={Boolean(hideNavigation)}
          globeProps={{
            className: cx(!showContentList && styles.globe),
            backgroundColor,
            isAutoRoating: !showContentList,
          }}
        />
      </div>

      <ContentNavigation
        showContentList={showContentList}
        contents={contents}
        setSelectedContentId={setSelectedContentId}
      />
    </div>
  );
};

export default DataViewer;
