import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import cx from "classnames";

import { useContentParams } from "../../../hooks/use-content-params";

import config, { ALTITUDE_FACTOR_DESKTOP } from "../../../config/main";
import { getNavCoordinates } from "../../../libs/get-navigation-position";
import { replaceUrlPlaceholders } from "../../../libs/replace-url-placeholders";
import { getStorySplashImage } from "../../../libs/get-story-splash-image";

import { setSelectedContentAction } from "../../../reducers/content";
import { setSelectedLayerIds } from "../../../reducers/layers";
import { setFlyTo } from "../../../reducers/fly-to";

import { contentSelector } from "../../../selectors/content";

import { LayerListItem } from "../../../types/layer-list";
import { StoryListItem } from "../../../types/story-list";
import { AppRoute } from "../../../types/app-routes";

import { useNavGestures } from "../../../libs/use-nav-gestures";

import { DownloadButton } from "../download-button/download-button";
import { Layers } from "../../stories/story/blocks/story-eei/constants/globe";

import styles from "./content-navigation.module.css";

function isStoryListItem(
  obj: StoryListItem | LayerListItem,
): obj is StoryListItem {
  return obj && obj.id.startsWith("story-");
}

interface Props {
  contents: (StoryListItem | LayerListItem)[];
  className?: string;
  isMobile: boolean;
}

// Per-item component so each item can call useTransform at the top level
interface ItemProps {
  item: StoryListItem | LayerListItem;
  index: number;
  currentIndex: number;
  y: ReturnType<typeof useMotionValue<number>>;
  opacity: ReturnType<typeof useMotionValue<number>>;
  category: string | null;
  isMobile: boolean;
  GAP_BETWEEN_ELEMENTS: number;
  RADIUS: number;
  onFocus: (index: number) => void;
}

const ContentNavItem: FunctionComponent<ItemProps> = ({
  opacity,
  item,
  index,
  currentIndex,
  y,
  category,
  isMobile,
  GAP_BETWEEN_ELEMENTS,
  RADIUS,
  onFocus,
}) => {
  const { id } = item;
  const name = "title" in item ? item.title : item.name;

  const isStory = isStoryListItem(item);

  const type = isStory ? "blog" : "layer";

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

  const opacityValue = useTransform(opacity, (v) => {
    const diff = Math.abs(index - v);
    return diff === 0 ? 1 : Math.pow(0.4, diff) * 1;
  });

  const rotate = useTransform(y, (v) => `${(index - v) * 12}deg`);

  const pointerEvents = useTransform(y, (v) =>
    Math.round(v) === index ? "auto" : "none",
  );

  const isActive = currentIndex === index;

  return (
    <motion.li
      data-content-id={item.id}
      data-layer-id={isStory ? "" : id}
      className={cx(styles.contentNavItem, isActive && styles.active)}
      key={index}
      aria-label={`${type} content: ${name}`}
      tabIndex={isActive ? 0 : -1}
      role="option"
      aria-selected={isActive}
      initial={{
        y: "-50%",
      }}
      style={{ top, left, opacity: opacityValue, rotate, pointerEvents }}
      onFocus={() => onFocus(index)}
    >
      <Link to={isStory ? `/${category}/stories/${id}/0` : `/${category}/data`}>
        <div>
          <span>{name}</span>
          {/* for electron*/}
          <DownloadButton url={downloadUrl} id={item.id} />
        </div>
      </Link>
      <span className={styles.typeInfo}>{isStory ? "Story" : "Dataset"}</span>
    </motion.li>
  );
};

const ContentNavigation: FunctionComponent<Props> = ({
  contents,
  className,
  isMobile,
}) => {
  const dispatch = useDispatch();
  const { category } = useContentParams();
  const { contentId } = useSelector(contentSelector);

  // Split contents into stories and datasets, placing stories first so they
  // appear above the active item on the arc and datasets below.
  const stories = contents.filter((c) => isStoryListItem(c));
  const datasets = contents.filter((c) => !isStoryListItem(c));

  // We want to show the datasets and stories seperately, with the default (active) element being a dataset (if availabe)
  const reordered = useMemo(
    () => (datasets.length > 0 ? [...stories, ...datasets] : [...stories]),
    [stories, datasets],
  );

  // When datasets exist the first dataset should be the active/center item.
  // When there are only stories, fall back to the current behavior (center the middle story).
  const centerIndex =
    datasets.length > 0 && stories.length > 0
      ? stories.length // first dataset, right after all stories
      : Math.floor((reordered.length - 1) / 2); // center of whichever group exists

  const initialIndex = reordered.findIndex(
    (content) => content.id === contentId,
  );

  const validInitialIndex = initialIndex !== -1 ? initialIndex : centerIndex;

  const [currentIndex, setCurrentIndex] = useState<number>(validInitialIndex);

  useNavGestures(reordered.length, setCurrentIndex, "y");

  // The spread between the elements in the circle
  const GAP_BETWEEN_ELEMENTS = 16;

  // The radius of the circle. We use a fixed radius here from
  // 0 - 100 because the coordinates are used as the top and left values
  // in a absolute positioned element. The advantage here is that the the elements
  // will automatically positioned and re-positioned based on the size of the parent container
  const RADIUS = isMobile ? 41 : 60;

  const y = useMotionValue(validInitialIndex);
  const opacity = useMotionValue(validInitialIndex);
  const splashSource = useMemo(() => {
    const contentId = reordered[currentIndex]?.id;
    if (isStoryListItem(reordered[currentIndex])) {
      if (contentId !== AppRoute.StoryEEI) {
        return getStorySplashImage(contentId);
      }
    }
    return "";
  }, [currentIndex, reordered]);

  useEffect(() => {
    animate(y, currentIndex, { type: "spring", stiffness: 500, damping: 35 });
    animate(opacity, currentIndex, { duration: 0.1 });
  }, [currentIndex, y, opacity]);

  useEffect(() => {
    const contentId = reordered[currentIndex]?.id;

    dispatch(setSelectedContentAction({ contentId }));

    // We don't want to dispatch a layer action with story ids (except for EEI-story)
    if (isStoryListItem(reordered[currentIndex])) {
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
  }, [dispatch, currentIndex, reordered]);

  // Trigger flyTo when the user remains on the previewed list item for 1 second
  // Checks if the position is given
  useEffect(() => {
    const contentId = reordered[currentIndex]?.id;

    const timeout = setTimeout(() => {
      if (contentId) {
        const previewedContent = reordered.find(({ id }) => id === contentId);

        const altitude =
          config.globe.view.altitude *
          (isMobile ? 1.2 : ALTITUDE_FACTOR_DESKTOP);

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
  }, [dispatch, currentIndex, reordered, isMobile]);

  // Get the middle x coordinate for the highlight of the active item
  const { x } = getNavCoordinates(0, GAP_BETWEEN_ELEMENTS, RADIUS, isMobile);

  return (
    <>
      <div className={styles.splashImageWrapper}>
        {splashSource ? (
          <img
            src={splashSource}
            alt=""
            className={styles.splashImage}
            rel="preload"
          />
        ) : null}
      </div>
      <motion.ul
        key="content-ul"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{opacity: 0}}
        className={cx(
          styles.contentNav,
          className,
        )}
        role="listbox"
        aria-label="Content navigation"
      >
        {reordered.map((item, index) => (
          <ContentNavItem
            key={item.id}
            item={item}
            index={index}
            currentIndex={currentIndex}
            y={y}
            opacity={opacity}
            category={category}
            isMobile={isMobile}
            GAP_BETWEEN_ELEMENTS={GAP_BETWEEN_ELEMENTS}
            RADIUS={RADIUS}
            onFocus={setCurrentIndex}
          />
        ))}
        {/* This is the highlight of the currently selected item.
      It serves a visual purpose only */}
        <span
          aria-hidden="true"
          style={{
            // The 8px or 24px is the offset of the highlight to the left
            left: `calc(${x}% - ${isMobile ? "16" : "12"}px)`,
          }}
        ></span>
      </motion.ul>
    </>
  );
};

export default ContentNavigation;
