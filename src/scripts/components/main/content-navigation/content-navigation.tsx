import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import cx from "classnames";

import { layersApi, useGetStoriesQuery } from "../../../services/api";

import { getNavCoordinates } from "../../../libs/get-navigation-position";

import { setShowLayer } from "../../../reducers/show-layer-selector";
import { setSelectedLayerIds } from "../../../reducers/layers";
import { setSelectedContentAction } from "../../../reducers/content";
import { toggleEmbedElements } from "../../../reducers/embed-elements";
import { setFlyTo } from "../../../reducers/fly-to";

import { languageSelector } from "../../../selectors/language";
import { contentSelector } from "../../../selectors/content";

import { LayerListItem } from "../../../types/layer-list";
import { StoryListItem } from "../../../types/story-list";
import { GalleryItemType } from "../../../types/gallery-item";
import { Story } from "../../../types/story";

import useAutoRotate from "../../../hooks/use-auto-content-rotation";
import {
  useContentScrollHandlers,
  useContentTouchHandlers,
} from "./use-content-event-handlers";

import styles from "./content-navigation.module.css";

function isStoryListItem(
  obj: StoryListItem | LayerListItem,
): obj is StoryListItem {
  return obj && "title" in obj && "image" in obj;
}

interface Props {
  showContentList: boolean;
  contents: (StoryListItem | LayerListItem)[];
  category: string | null;
  className?: string;
  isMobile: boolean;
}

const ContentNavigation: FunctionComponent<Props> = ({
  category,
  showContentList,
  contents,
  className,
  isMobile,
}) => {
  const navigationRef = React.useRef<HTMLUListElement | null>(null);
  const dispatch = useDispatch();
  const thunkDispatch = useThunkDispatch();
  const { trackEvent } = useMatomo();
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
    Date.now(),
  );

  const { handleTouchEnd, handleTouchMove } = useContentTouchHandlers(
    currentIndex,
    setCurrentIndex,
    contents.length,
    setLastUserInteractionTime,
  );

  const { handleWheel } = useContentScrollHandlers(
    setCurrentIndex,
    contents.length,
    setLastUserInteractionTime,
  );

  // The spread between the elements in the circle
  const GAP_BETWEEN_ELEMENTS = 16;

  // The radius of the circle. We use a fixed radius here from
  // 0 - 100 because the coordinates are used as the top and left values
  // in a absolute positioned element. The advantage here is that the the elements
  // will automatically positioned and re-positioned based on the size of the parent container
  const RADIUS = 40;

  useEffect(() => {
    const listItems = navigationRef.current?.querySelectorAll("li");

    if (!listItems) {
      return;
    }

    for (const [index, item] of Array.from(listItems).entries()) {
      const adjustedPosition = index - currentIndex;

      const { x, y } = getNavCoordinates(
        adjustedPosition,
        GAP_BETWEEN_ELEMENTS,
        RADIUS,
        isMobile,
      );

      // 12 degrees of rotation per item
      const _rotationAngle = 12;
      const rotation = adjustedPosition * _rotationAngle;
      const opacity =
        adjustedPosition === 0
          ? 1
          : Math.pow(0.5, Math.abs(adjustedPosition)) * 0.5;

      // disalbe pointer events for items that are not in the center
      item.style.pointerEvents = adjustedPosition === 0 ? "auto" : "none";
      item.style.top = `${y}%`;
      item.style.left = `${x}%`;
      item.style.opacity = `${opacity}`;
      item.style.rotate = `${rotation}deg`;
      item.classList.toggle(styles.active, adjustedPosition === 0);
    }
  }, [currentIndex, showContentList, contents.length, isMobile]);

  // Auto initialize auto-rotation on user inactivity
  useAutoRotate({
    lastUserInteractionTime,
    setCurrentIndex,
    itemsLength: contents.length,
  });

  useEffect(() => {
    const id = contents[currentIndex]?.id;

    dispatch(
      setSelectedContentAction({ contentId: contents[currentIndex].id }),
    );
    // We don't want to dispatch a layer action with story ids
    if (isStoryListItem(contents[currentIndex])) {
      dispatch(setSelectedLayerIds({ layerId: null, isPrimary: true }));
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(setSelectedLayerIds({ layerId: id, isPrimary: true }));
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
        const previewedContent = contents.find(
          (story) => story.id === contentId,
        );

        if (
          previewedContent &&
          "position" in previewedContent &&
          previewedContent.position[0] &&
          previewedContent.position[1]
        ) {
          dispatch(
            setFlyTo({
              isAnimated: true,
              lat: previewedContent.position[1],
              lng: previewedContent.position[0],
            }),
          );
        }
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, currentIndex, contents]);

  // fucntion to handle click and keyboard events
  const handleItemSelection = (
    id: string,
    index: number,
    name: string,
    isStory: boolean,
    element?: HTMLElement,
  ) => {
    dispatch(setSelectedContentAction({ contentId: id }));
    setCurrentIndex(index);

    if (!isStory) {
      dispatch(setShowLayer(false));
      thunkDispatch(layersApi.endpoints.getLayer.initiate(id));
      dispatch(setSelectedLayerIds({ layerId: id, isPrimary: true }));
      dispatch(toggleEmbedElements({ legend: true, time_slider: true }));
      trackEvent({
        category: "datasets",
        action: "select",
        name,
      });
    }

    // For keyboard events, we need to programmatically navigate
    if (element) {
      const linkElement = element.querySelector("a");
      if (linkElement) {
        linkElement.click();
      }
    }
  };

  // Get the middle x coordinate for the highlight of the active item
  const { x } = getNavCoordinates(0, GAP_BETWEEN_ELEMENTS, RADIUS, isMobile);

  const { data: stories } = useGetStoriesQuery({
    ids: contents.filter((el) => isStoryListItem(el)).map(({ id }) => id),
    language: lang,
  });

  const getStoryMediaType = (item: StoryListItem, stories?: Story[]) => {
    let type = "blog";

    const story = stories?.find((story) => story.id === item.id);
    const galleyItemTypes = new Set(
      story?.slides
        .flatMap((slide) => slide.galleryItems)
        .map(({ type }) => type),
    );
    if (
      // if gallery only contains images or videos return media type
      galleyItemTypes.size === 1 &&
      (galleyItemTypes.has(GalleryItemType.Image) ||
        galleyItemTypes.has(GalleryItemType.Video))
    ) {
      type = [...galleyItemTypes][0];
    }
    return type;
  };

  return (
    <ul
      ref={navigationRef}
      className={cx(
        styles.contentNav,
        showContentList && styles.show,
        className,
      )}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onWheel={handleWheel}
      role="listbox"
      aria-label="Content navigation"
    >
      {contents.map((item, index) => {
        const { id } = item;
        const name = "title" in item ? item.title : item.name;
        const isStory = isStoryListItem(item);
        const type = isStory ? getStoryMediaType(item, stories) : "layer";

        return (
          <li
            // Used n CSS to get the correct icon for the content type
            data-content-type={type}
            // Used to identify the currently seletected content.
            // Passed to the globe via props to make sure correct actions are triggered
            // E.g. flyTo or show the data layer
            data-content-id={item.id}
            data-layer-id={isStory ? "" : id}
            className={cx(styles.contentNavItem)}
            key={index}
            aria-label={`${type} content: ${name}`}
            // Make only the current item focusable in the tab order
            // This creates a "roving tabindex" pattern
            tabIndex={index === currentIndex ? 0 : -1}
            role="button"
            aria-selected={index === currentIndex}
            onFocus={() => {
              // When an item receives focus, update the current index
              setCurrentIndex(index);
              dispatch(setSelectedContentAction({ contentId: id }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleItemSelection(id, index, name, isStory, e.currentTarget);
              }
            }}
            onClick={() => {
              handleItemSelection(id, index, name, isStory);
            }}
          >
            <Link
              to={isStory ? `${category}/stories/${id}/0/` : `${category}/data`}
            >
              <span>{name}</span>
              {!isMobile && (
                <span className={cx(styles.learnMore)}>
                  <FormattedMessage id="learn_more" />
                </span>
              )}
            </Link>
          </li>
        );
      })}
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
