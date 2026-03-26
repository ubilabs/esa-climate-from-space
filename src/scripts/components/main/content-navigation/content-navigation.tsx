import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import cx from "classnames";

import { Layers } from "../../stories/story/blocks/story-eei/constants/globe";
import config, { ALTITUDE_FACTOR_DESKTOP } from "../../../config/main";
import { useGetStoriesQuery } from "../../../services/api";

import { getNavCoordinates } from "../../../libs/get-navigation-position";
import { replaceUrlPlaceholders } from "../../../libs/replace-url-placeholders";
import { getStoryMediaType } from "../../../libs/get-story-media-type";

import { setSelectedLayerIds } from "../../../reducers/layers";
import { setSelectedContentAction } from "../../../reducers/content";
import { setFlyTo } from "../../../reducers/fly-to";

import { languageSelector } from "../../../selectors/language";
import { contentSelector } from "../../../selectors/content";

import { LayerListItem } from "../../../types/layer-list";
import { StoryListItem } from "../../../types/story-list";
import { AppRoute } from "../../../types/app-routes";

import useAutoRotate from "../../../hooks/use-auto-content-rotation";
import { useNavGestures } from "../../../libs/use-nav-gestures";

import { DownloadButton } from "../download-button/download-button";

import styles from "./content-navigation.module.css";

import { animate, motion, useMotionValue, useTransform } from "motion/react";

function isStoryListItem(
  obj: StoryListItem | LayerListItem,
): obj is StoryListItem {
  return obj && obj.id.startsWith("story-");
}

interface Props {
  showContentList: boolean;
  contents: (StoryListItem | LayerListItem)[];
  category: string | null;
  className?: string;
  isMobile: boolean;
}

// Per-item component so each item can call useTransform at the top level
interface ItemProps {
  item: StoryListItem | LayerListItem;
  index: number;
  currentIndex: number;
  y: ReturnType<typeof useMotionValue<number>>;
  category: string | null;
  isMobile: boolean;
  GAP_BETWEEN_ELEMENTS: number;
  RADIUS: number;
  stories: ReturnType<typeof useGetStoriesQuery>["data"];
  onFocus: (index: number) => void;
}

const ContentNavItem: FunctionComponent<ItemProps> = ({
  item,
  index,
  currentIndex,
  y,
  category,
  isMobile,
  GAP_BETWEEN_ELEMENTS,
  RADIUS,
  stories,
  onFocus,
}) => {
  const { id } = item;
  const name = "title" in item ? item.title : item.name;
  const isStory = isStoryListItem(item);
  const type = isStory ? getStoryMediaType(item, stories) : "layer";
  const downloadUrl = replaceUrlPlaceholders(
    isStory ? config.api.storyOfflinePackage : config.api.layerOfflinePackage,
    { id: item.id },
  );

  const top = useTransform(y, (v) => {
    const { y: yCoord } = getNavCoordinates(
      index - v,
      GAP_BETWEEN_ELEMENTS,
      RADIUS,
      isMobile,
    );
    return `${yCoord}%`;
  });

  const left = useTransform(y, (v) => {
    const { x } = getNavCoordinates(
      index - v,
      GAP_BETWEEN_ELEMENTS,
      RADIUS,
      isMobile,
    );
    return `${x}%`;
  });

  const opacity = useTransform(y, (v) => {
    const d = index - v;
    return d === 0 ? 1 : Math.pow(0.5, Math.abs(d)) * 0.5;
  });

  const rotate = useTransform(y, (v) => `${(index - v) * 12}deg`);

  const pointerEvents = useTransform(y, (v) =>
    Math.round(v) === index ? "auto" : "none",
  );

  const isActive = currentIndex === index;

  return (
    <motion.li
      data-content-type={type}
      data-content-id={item.id}
      data-layer-id={isStory ? "" : id}
      className={cx(styles.contentNavItem, isActive && styles.active)}
      key={index}
      aria-label={`${type} content: ${name}`}
      tabIndex={isActive ? 0 : -1}
      role="option"
      aria-selected={isActive}
      style={{ top, left, opacity, rotate, pointerEvents }}
      onFocus={() => onFocus(index)}
    >
      <Link to={isStory ? `/${category}/stories/${id}/0` : `/${category}/data`}>
        <div>
          <span>{name}</span>
          {/* for electron*/}
          <DownloadButton url={downloadUrl} id={item.id} />
        </div>
        {!isMobile && (
          <span className={cx(styles.learnMore)}>
            <FormattedMessage id="learn_more" />
          </span>
        )}
      </Link>
    </motion.li>
  );
};

const ContentNavigation: FunctionComponent<Props> = ({
  category,
  showContentList,
  contents,
  className,
  isMobile,
}) => {
  const dispatch = useDispatch();
  const lang = useSelector(languageSelector);
  const { contentId } = useSelector(contentSelector);

  // We either use the centerIndex or the index of the selected content if there is one
  const centerIndex = Math.floor((contents.length - 1) / 2);
  const initialIndex = contents.findIndex(
    (content) => content.id === contentId,
  );

  const validInitialIndex = initialIndex !== -1 ? initialIndex : centerIndex;

  const [currentIndex, setCurrentIndex] = useState<number>(validInitialIndex);

  // Ref to store and control the auto-rotation interval
  const [lastUserInteractionTime, setLastUserInteractionTime] = useState(
    Date.now,
  );

  useNavGestures(
    contents.length,
    setCurrentIndex,
    setLastUserInteractionTime,
    "y",
  );

  // The spread between the elements in the circle
  const GAP_BETWEEN_ELEMENTS = 16;

  // The radius of the circle. We use a fixed radius here from
  // 0 - 100 because the coordinates are used as the top and left values
  // in a absolute positioned element. The advantage here is that the the elements
  // will automatically positioned and re-positioned based on the size of the parent container
  const RADIUS = 42;

  const y = useMotionValue(validInitialIndex);

  useEffect(() => {
    animate(y, currentIndex, { type: "spring", stiffness: 500, damping: 35 });
  }, [currentIndex, y]);

  // Auto initialize auto-rotation on user inactivity
  useAutoRotate({
    lastUserInteractionTime,
    setCurrentIndex,
    itemsLength: contents.length,
  });

  useEffect(() => {
    const contentId = contents[currentIndex]?.id;

    dispatch(setSelectedContentAction({ contentId }));
    // We don't want to dispatch a layer action with story ids (except for EEI-story)
    if (isStoryListItem(contents[currentIndex])) {
      if (contentId !== AppRoute.StoryEEI) {
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
      } else {
        dispatch(
          setSelectedLayerIds({ layerId: Layers.EEI_NO_MASK, isPrimary: true }),
        );
      }
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(setSelectedLayerIds({ layerId: contentId, isPrimary: true }));
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, currentIndex, contents]);

  // Trigger flyTo when the user remains on the previewed list item for 1 second
  // Checks if the position is given
  useEffect(() => {
    const contentId = contents[currentIndex]?.id;

    const timeout = setTimeout(() => {
      if (contentId) {
        const previewedContent = contents.find(({ id }) => id === contentId);

        const altitude =
          config.globe.view.altitude * (isMobile ? 1 : ALTITUDE_FACTOR_DESKTOP);

        dispatch(
          setFlyTo({
            ...(previewedContent?.position?.length === 2
              ? {
                  lat: previewedContent.position[1],
                  lng: previewedContent.position[0],
                  isAnimated: true,
                  altitude,
                }
              : {
                  ...config.globe.view,
                  isAnimated: true,
                  altitude,
                }),
          }),
        );
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, currentIndex, contents, isMobile]);

  // Get the middle x coordinate for the highlight of the active item
  const { x } = getNavCoordinates(0, GAP_BETWEEN_ELEMENTS, RADIUS, isMobile);

  const { data: stories } = useGetStoriesQuery({
    ids: contents.filter((el) => isStoryListItem(el)).map(({ id }) => id),
    language: lang,
  });

  return (
    <ul
      className={cx(
        styles.contentNav,
        showContentList && styles.show,
        className,
      )}
      role="listbox"
      aria-label="Content navigation"
    >
      {contents.map((item, index) => (
        <ContentNavItem
          key={item.id}
          item={item}
          index={index}
          currentIndex={currentIndex}
          y={y}
          category={category}
          isMobile={isMobile}
          GAP_BETWEEN_ELEMENTS={GAP_BETWEEN_ELEMENTS}
          RADIUS={RADIUS}
          stories={stories}
          onFocus={setCurrentIndex}
        />
      ))}
      {/* This is the highlight of the currently selected item.
      It serves a visual purpose only */}
      <span
        aria-hidden="true"
        style={{
          // The 8px or 24px is the offset of the highlight to the left
          left: `calc(${x}% - ${isMobile ? "8" : "24"}px)`,
        }}
      ></span>
    </ul>
  );
};

export default ContentNavigation;
