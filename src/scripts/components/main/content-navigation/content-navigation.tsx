import {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  WheelEvent as ReactWheelEvent,
} from "react";
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

import { useMobileMomentumNav } from "../../../libs/use-mobile-momentum-nav";
import { useGlobalKeyboardNavigation } from "../../../hooks/use-global-keyboard-navigation";

import { DownloadButton } from "../download-button/download-button";
import { Layers } from "../../stories/story/blocks/story-eei/constants/globe";

import styles from "./content-navigation.module.css";

const DESKTOP_WHEEL_STEP_THRESHOLD = 80;
const DESKTOP_WHEEL_IDLE_MS = 140;
const DESKTOP_WHEEL_NEW_GESTURE_DELTA = 24;
const DESKTOP_WHEEL_RETRIGGER_MS = 90;

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
  selectedLinkRef,
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
        to={isStory ? `/${category}/stories/${id}/0` : `/${category}/data`}
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

  const [currentIndex, setCurrentIndex] = useState<number>(validInitialIndex);
  const [previewIndex, setPreviewIndex] = useState<number>(validInitialIndex);
  const [settledIndex, setSettledIndex] = useState<number | null>(
    validInitialIndex,
  );
  const listRef = useRef<HTMLUListElement | null>(null);
  const [stepPx, setStepPx] = useState(1);
  const wheelDeltaRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const lastWheelTriggerTimeRef = useRef(0);
  const wheelIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const hasInitializedSettledIndexRef = useRef(false);

  // The spread between the elements in the circle
  const GAP_BETWEEN_ELEMENTS = isMobile ? 16 : 12;

  // The radius of the circle. We use a fixed radius here from
  // 0 - 100 because the coordinates are used as the top and left values
  // in a absolute positioned element. The advantage here is that the the elements
  // will automatically positioned and re-positioned based on the size of the parent container
  const RADIUS = isMobile ? 41 : 60;

  const y = useMotionValue(validInitialIndex);
  const opacity = useMotionValue(validInitialIndex);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  const { index: dragIndex, panHandlers } = useMobileMomentumNav({
    itemCount: reordered.length,
    initialIndex: currentIndex,
    stepPx,
    infinite: false,
    isEnabled: isMobile,
    onIndexChange: setCurrentIndex,
  });

  const refreshWheelIdle = () => {
    if (wheelIdleTimeoutRef.current) {
      clearTimeout(wheelIdleTimeoutRef.current);
    }

    wheelIdleTimeoutRef.current = setTimeout(() => {
      wheelLockedRef.current = false;
      wheelDeltaRef.current = 0;
      wheelIdleTimeoutRef.current = null;
    }, DESKTOP_WHEEL_IDLE_MS);
  };

  const moveIndex = (direction: -1 | 1) => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = Math.min(
        reordered.length - 1,
        Math.max(0, prevIndex + direction),
      );

      if (nextIndex !== prevIndex) {
        setPreviewIndex(nextIndex);
      }

      return nextIndex;
    });
  };

  useGlobalKeyboardNavigation({
    enabled: !isMobile && reordered.length > 1,
    onPrevious: () => moveIndex(-1),
    onNext: () => moveIndex(1),
    onActivate: () => {
      activeLinkRef.current?.click();
    },
  });

  const handleWheel = (event: ReactWheelEvent<HTMLUListElement>) => {
    if (isMobile || reordered.length <= 1) {
      return;
    }

    const now = performance.now();

    event.preventDefault();
    refreshWheelIdle();

    if (wheelLockedRef.current) {
      const isFreshGesture =
        Math.abs(event.deltaY) >= DESKTOP_WHEEL_NEW_GESTURE_DELTA &&
        now - lastWheelTriggerTimeRef.current >= DESKTOP_WHEEL_RETRIGGER_MS;

      if (!isFreshGesture) {
        return;
      }

      wheelLockedRef.current = false;
      wheelDeltaRef.current = 0;
    }

    wheelDeltaRef.current += event.deltaY;

    if (Math.abs(wheelDeltaRef.current) < DESKTOP_WHEEL_STEP_THRESHOLD) {
      return;
    }

    const direction = Math.sign(wheelDeltaRef.current);
    wheelLockedRef.current = true;
    lastWheelTriggerTimeRef.current = now;
    const nextIndex = Math.min(
      reordered.length - 1,
      Math.max(0, currentIndex + direction),
    );

    wheelDeltaRef.current = 0;

    if (nextIndex === currentIndex) {
      return;
    }

    setPreviewIndex(nextIndex);
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    return () => {
      if (wheelIdleTimeoutRef.current) {
        clearTimeout(wheelIdleTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasInitializedSettledIndexRef.current) {
      hasInitializedSettledIndexRef.current = true;
      setSettledIndex(currentIndex);
      return;
    }

    setSettledIndex(null);

    const timeout = setTimeout(() => {
      setSettledIndex(currentIndex);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentIndex]);

  useLayoutEffect(() => {
    if (!isMobile || !listRef.current || reordered.length <= 1) {
      return;
    }

    const measureStep = () => {
      const items = Array.from(
        listRef.current?.querySelectorAll<HTMLLIElement>("li[data-index]") ??
          [],
      );

      if (items.length <= 1) {
        return;
      }

      const activeIndex = Math.min(currentIndex, items.length - 2);
      const currentItem = items[activeIndex];
      const nextItem = items[activeIndex + 1];

      if (!currentItem || !nextItem) {
        return;
      }

      const currentTop = currentItem.getBoundingClientRect().top;
      const nextTop = nextItem.getBoundingClientRect().top;
      const nextStep = Math.abs(nextTop - currentTop);

      if (nextStep > 0) {
        setStepPx(nextStep);
      }
    };

    measureStep();
    window.addEventListener("resize", measureStep);

    return () => {
      window.removeEventListener("resize", measureStep);
    };
  }, [currentIndex, isMobile, reordered.length]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewIndex(currentIndex);
    animate(y, currentIndex, { type: "spring", stiffness: 500, damping: 35 });
    animate(opacity, currentIndex, { duration: 0.1 });
  }, [currentIndex, isMobile, y, opacity]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const unsubscribe = dragIndex.on("change", (value) => {
      y.set(value);
      opacity.set(value);
      setPreviewIndex(Math.round(value));
    });

    const nextIndex = dragIndex.get();
    y.set(nextIndex);
    opacity.set(nextIndex);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewIndex(Math.round(nextIndex));
    return unsubscribe;
  }, [dragIndex, isMobile, opacity, y]);

  const settledContent =
    settledIndex === null ? null : (reordered[settledIndex] ?? null);
  const settledContentId = settledContent?.id;

  useEffect(() => {
    dispatch(setSelectedContentAction({ contentId: settledContentId ?? null }));
  }, [dispatch, settledContentId]);

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

  useEffect(() => {
    if (!settledContentId || !settledContent) {
      dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
      return;
    }

    // We don't want to dispatch a layer action with story ids (except for EEI-story)
    if (isStoryListItem(settledContent)) {
      if (settledContentId !== AppRoute.StoryEEI) {
        dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
      } else {
        dispatch(
          setSelectedLayerIds({ layerId: Layers.EEI_NO_MASK, isPrimary: true }),
        );
      }
      return;
    }

    dispatch(
      setSelectedLayerIds({ layerId: settledContentId, isPrimary: true }),
    );
  }, [dispatch, settledContent, settledContentId, settledIndex]);

  useEffect(() => {
    if (!settledContentId || !settledContent) {
      return;
    }

    const altitude =
      config.globe.view.altitude * (isMobile ? 1.2 : ALTITUDE_FACTOR_DESKTOP);

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
        onWheel={handleWheel}
        onPanSessionStart={panHandlers.onPanSessionStart}
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
            selectedLinkRef={activeLinkRef}
          />
        ))}
        {/* This is the highlight of the currently selected item.
      It serves a visual purpose only */}
        {settledIndex !== null ? (
          <span
            aria-hidden="true"
            style={{
              // The 8px or 24px is the offset of the highlight to the left
              left: `calc(${x}% - ${isMobile ? "16" : "12"}px)`,
            }}
          ></span>
        ) : null}
      </motion.ul>
    </>
  );
};

export default ContentNavigation;
