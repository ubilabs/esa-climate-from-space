import {
  useCallback,
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import cx from "classnames";

import { useContentParams } from "../../../hooks/use-content-params";
import { useScreenInfo } from "../../../hooks/use-screen-info";

import config, {
  ALTITUDE_FACTOR_DESKTOP,
  ALTITUDE_FACTOR_MOBILE,
} from "../../../config/main";
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
import { AppLocationState } from "../../../types/location-state";

import { useNavigationControls } from "../../../hooks/use-navigation-controls";

import { DownloadButton } from "../download-button/download-button";
import { Layers } from "../../stories/story/blocks/story-eei/constants/globe";
import { SwipeUpIcon } from "../icons/swipe-up-icon";
import { SwipeDownIcon } from "../icons/swipe-down-icon";
import { MouseScrollIcon } from "../icons/mouse-scroll-icon";
import { ArrowKeysIcon } from "../icons/arrow-keys-icon";

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
  dataIndex: number;
  activeIndex: number;
  y: ReturnType<typeof useMotionValue<number>>;
  opacity: ReturnType<typeof useMotionValue<number>>;
  category: string | null;
  isMobile: boolean;
  GAP_BETWEEN_ELEMENTS: number;
  RADIUS: number;
  onFocus: (index: number) => void;
  onSelect: (item: StoryListItem | LayerListItem) => void;
  selectedLinkRef?: React.RefObject<HTMLAnchorElement | null>;
}

const ContentNavItem: FunctionComponent<ItemProps> = ({
  opacity,
  item,
  index,
  dataIndex,
  activeIndex,
  y,
  category,
  isMobile,
  GAP_BETWEEN_ELEMENTS,
  RADIUS,
  onFocus,
  onSelect,
  selectedLinkRef,
}) => {
  const location = useLocation();
  const { id } = item;
  const name = "title" in item ? item.title : item.name;

  const isStory = isStoryListItem(item);
  const to = isStory ? `/${category}/stories/${id}/0` : `/${category}/data`;
  const currentPath = `${location.pathname}${location.search}`;
  const previousBackLink = location.state?.backLink;
  const backLink =
    to === currentPath
      ? previousBackLink !== currentPath
        ? previousBackLink
        : undefined
      : currentPath;

  const navigationState: AppLocationState | undefined = backLink
    ? {
        ...location.state,
        backLink,
      }
    : location.state;

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

  const isActive = activeIndex === index;

  return (
    <motion.li
      data-index={dataIndex}
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
      style={{
        top,
        left,
        opacity: opacityValue,
        rotate,
        pointerEvents: isMobile ? pointerEvents : "auto",
      }}
      onFocus={() => onFocus(index)}
    >
      <Link
        ref={isActive ? selectedLinkRef : undefined}
        to={to}
        state={navigationState}
        onClick={() => onSelect(item)}
      >
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
  const { isTouchDevice } = useScreenInfo();
  const { contentId } = useSelector(contentSelector);

  // Split contents into stories and datasets, placing stories first so they
  // appear above the active item on the arc and datasets below.
  const stories = contents
    .filter((c): c is StoryListItem => isStoryListItem(c))
    .sort((a, b) => b.title.localeCompare(a.title));

  const datasets = contents
    .filter((c): c is LayerListItem => !isStoryListItem(c))
    .sort((a, b) => a.name.localeCompare(b.name));

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

  const [settledIndex, setSettledIndex] = useState<number | null>(
    validInitialIndex,
  );
  const hasInitializedSettledIndexRef = useRef(false);
  const settledIndexTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // The spread between the elements in the circle
  const GAP_BETWEEN_ELEMENTS = isMobile ? 16 : 12;

  // The radius of the circle. We use a fixed radius here from
  // 0 - 100 because the coordinates are used as the top and left values
  // in a absolute positioned element. The advantage here is that the the elements
  // will automatically positioned and re-positioned based on the size of the parent container
  const RADIUS = isMobile ? 41 : 60;

  const y = useMotionValue(validInitialIndex);
  const opacity = useMotionValue(validInitialIndex);

  const clearSettledIndexTimeout = useCallback(() => {
    if (settledIndexTimeoutRef.current) {
      clearTimeout(settledIndexTimeoutRef.current);
      settledIndexTimeoutRef.current = null;
    }
  }, []);

  const scheduleSettledIndex = useCallback(
    (index: number) => {
      clearSettledIndexTimeout();
      settledIndexTimeoutRef.current = setTimeout(() => {
        setSettledIndex(index);
        settledIndexTimeoutRef.current = null;
      }, 1000);
    },
    [clearSettledIndexTimeout],
  );

  const [hasScrolled, setHasScrolled] = useState(false);

  const {
    currentIndex,
    setCurrentIndex,
    previewIndex,
    listRef,
    selectedLinkRef: activeLinkRef,
    handleWheel,
    panHandlers,
  } = useNavigationControls({
    itemCount: reordered.length,
    initialIndex: validInitialIndex,
    isMobile,
    onSyncPreviewValue: (value) => {
      y.set(value);
      opacity.set(value);
    },
    onAnimateToCurrentIndex: (nextIndex) => {
      const yAnimation = animate(y, nextIndex, {
        type: "tween",
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      });
      const opacityAnimation = animate(opacity, nextIndex, {
        duration: 0.12,
        ease: "easeOut",
      });

      return () => {
        yAnimation.stop();
        opacityAnimation.stop();
      };
    },
    onDesktopGestureStart: () => {
      clearSettledIndexTimeout();
      setSettledIndex(null);
    },
    onDesktopGestureEnd: (nextIndex) => {
      scheduleSettledIndex(nextIndex);
    },
    onMobilePanSessionStart: () => {
      clearSettledIndexTimeout();
      setSettledIndex(null);
    },
    onMobilePanEnd: (nextIndex) => {
      scheduleSettledIndex(nextIndex);
    },
    onKeyboardNavigation: () => {
      setHasScrolled(true);
    },
  });

  useEffect(() => clearSettledIndexTimeout, [clearSettledIndexTimeout]);

  useEffect(() => {
    if (!hasInitializedSettledIndexRef.current) {
      hasInitializedSettledIndexRef.current = true;
      setSettledIndex(currentIndex);
      return;
    }

    setSettledIndex(null);

    scheduleSettledIndex(currentIndex);

    return () => {
      clearSettledIndexTimeout();
    };
  }, [currentIndex, clearSettledIndexTimeout, scheduleSettledIndex]);

  const settledContent =
    settledIndex === null ? null : (reordered[settledIndex] ?? null);
  const settledContentId = settledContent?.id;

  useEffect(() => {
    if (!settledContentId) {
      return;
    }

    dispatch(setSelectedContentAction({ contentId: settledContentId }));
  }, [dispatch, settledContentId]);

  useEffect(() => {
    const list = listRef.current;

    if (!list || isMobile) {
      return;
    }

    const handleNativeWheel = (event: WheelEvent) => {
      setHasScrolled(true);
      handleWheel(event);
    };

    list.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      list.removeEventListener("wheel", handleNativeWheel);
    };
  }, [handleWheel, isMobile, listRef]);

  const splashSource = useMemo(() => {
    if (
      settledContent &&
      isStoryListItem(settledContent) &&
      settledContentId !== AppRoute.StoryEEI
    ) {
      return getStorySplashImage(settledContentId);
    }

    return "";
  }, [settledContent, settledContentId]);

  const applySelection = useCallback(
    (content: StoryListItem | LayerListItem) => {
      dispatch(setSelectedContentAction({ contentId: content.id }));

      if (isStoryListItem(content)) {
        if (content.id !== AppRoute.StoryEEI) {
          dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
        } else {
          dispatch(
            setSelectedLayerIds({ layerId: Layers.EEI_NO_MASK, isPrimary: true }),
          );
        }

        return;
      }

      dispatch(setSelectedLayerIds({ layerId: content.id, isPrimary: true }));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!settledContentId || !settledContent) {
      return;
    }

    applySelection(settledContent);
  }, [applySelection, settledContent, settledContentId, settledIndex]);

  useEffect(() => {
    if (!settledContentId || !settledContent) {
      return;
    }

    const altitude =
      config.globe.view.altitude *
      (isMobile ? ALTITUDE_FACTOR_MOBILE : ALTITUDE_FACTOR_DESKTOP);

    dispatch(
      setFlyTo({
        ...(settledContent?.position?.length === 2
          ? {
              lat: settledContent.position[1],
              lng: settledContent.position[0],
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
  }, [dispatch, isMobile, settledContent, settledContentId, settledIndex]);

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
        ref={listRef}
        key="content-ul"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.4, ease: "easeOut", delay: 1 },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        }}
        className={cx(styles.contentNav, className)}
        role="listbox"
        aria-label="Content navigation"
        onPanSessionStart={() => {
          setHasScrolled(true);
          panHandlers.onPanSessionStart();
        }}
        onPan={panHandlers.onPan}
        onPanEnd={panHandlers.onPanEnd}
      >
        {reordered.map((item, index) => (
          <ContentNavItem
            key={item.id}
            item={item}
            index={index}
            dataIndex={index}
            activeIndex={previewIndex}
            y={y}
            opacity={opacity}
            category={category ?? null}
            isMobile={isMobile}
            GAP_BETWEEN_ELEMENTS={GAP_BETWEEN_ELEMENTS}
            RADIUS={RADIUS}
            onFocus={setCurrentIndex}
            onSelect={applySelection}
            selectedLinkRef={activeLinkRef}
          />
        ))}
        {/* This is the highlight of the currently selected item.
      It serves a visual purpose only */}
        {settledIndex !== null ? (
          <span
            aria-hidden="true"
            style={{
              left: `calc(${x}% - ${isMobile ? "16" : "12"}px)`,
            }}
          ></span>
        ) : null}
      </motion.ul>
      <div
        className={cx(
          styles.scrollHint,
          hasScrolled && styles.scrollHintHidden,
        )}
        aria-hidden="true"
      >
        {isTouchDevice ? (
          <div className={styles.scrollHintMobile}>
            <div className={styles.scrollHintSwipeItem}>
              <SwipeUpIcon />
              <span className={styles.scrollHintLabel}>
                <FormattedMessage id="contentNav.hintStories" />
              </span>
            </div>
            <div className={styles.scrollHintSwipeItem}>
              <SwipeDownIcon />
              <span className={styles.scrollHintLabel}>
                <FormattedMessage id="contentNav.hintDatasets" />
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.scrollHintDesktop}>
            <div className={styles.scrollHintIcons}>
              <MouseScrollIcon />
              <ArrowKeysIcon isWhite />
            </div>
            <p className={styles.scrollHintText}>
              <FormattedMessage id="contentNav.scrollHint" />
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentNavigation;
