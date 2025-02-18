import { useHistory, useParams } from "react-router-dom";

import { LayerLoadingState } from "@ubilabs/esa-webgl-globe";

import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useGetStoriesQuery } from "../../../services/api";
import { languageSelector } from "../../../selectors/language";

import ContentNavigation from "../content-navigation/content-navigation";
import Button from "../button/button";
import CategoryNavigation from "../category-navigation/category-navigation";

import { setSelectedTags } from "../../../reducers/story";

import { useScreenSize } from "../../../hooks/use-screen-size";

import cx from "classnames";

import styles from "./data-viewer.module.css";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { State } from "../../../reducers";
import { layerListItemSelector } from "../../../selectors/layers/list-item";
import { GetDataWidget } from "../data-widget/data-widget";

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

const DataViewer: FunctionComponent<Props> = ({
  backgroundColor,
  hideNavigation,
}) => {
  // const dispatch = useDispatch();
  const { category } = useParams<RouteParams>();

  const [showContentList, setShowContentList] = useState<boolean>(
    Boolean(category),
  );

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { compareId } = selectedLayerIds;
  // const mainLayer = useSelector((state: State) =>
  //  layerListItemSelector(state, mainId),
  //);

  const compareLayer = useSelector((state: State) =>
    layerListItemSelector(state, compareId),
  );

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    category || null,
  );

  const history = useHistory();

  const { screenWidth } = useScreenSize();

  const language = useSelector(languageSelector);
  const { data: stories } = useGetStoriesQuery(language);

  // There is a set of animations which should be played only once
  // This keeps track of that
  const hasAnimationPlayed = useRef(Boolean(category));

  useEffect(() => {
    setShowContentList(Boolean(category));
  }, [category]);

  if (!stories) {
    return null;
  }

  const allTags: string[] = stories
    .map(({ tags }) => tags)
    .filter(Boolean)
    .flat();
  const uniqTags = Array.from(new Set(allTags));

  const contents = stories.filter(
    (story) => category && story.tags?.includes(category),
  );
  // create a list of all tags with their number of occurrences in the stories
  // For now, we filter out tags with less than 3 occurrences as long as we don't have the new categories

  const arcs = uniqTags
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
        <GetDataWidget hideNavigation={Boolean(hideNavigation)} backgroundColor={backgroundColor} />
      </div>

      <ContentNavigation
        showContentList={showContentList}
        contents={contents}
      />

      {compareLayer && <GetDataWidget  hideNavigation={Boolean(hideNavigation)} backgroundColor={backgroundColor} />}
    </div>
  );
};

export default DataViewer;
