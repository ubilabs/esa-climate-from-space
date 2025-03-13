import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import cx from "classnames";

import { layersApi } from "../../../services/api";

import { getNavCoordinates } from "../../../libs/get-navigation-position";

import { setShowLayer } from "../../../reducers/show-layer-selector";
import { setSelectedLayerIds } from "../../../reducers/layers";

import { LayerListItem } from "../../../types/layer-list";
import { StoryListItem } from "../../../types/story-list";

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
  setSelectedContentId: React.Dispatch<React.SetStateAction<string | null>>;
  category: string | null;
  className?: string;
  isMobile: boolean;
}

const ContentNavigation: FunctionComponent<Props> = ({
  category,
  showContentList,
  contents,
  setSelectedContentId,
  className,
  isMobile,
}) => {
  const navigationRef = React.useRef<HTMLUListElement | null>(null);
  const dispatch = useDispatch();
  const thunkDispatch = useThunkDispatch();
  const { trackEvent } = useMatomo();

  const [currentIndex, setCurrentIndex] = useState(0);
  const entryCount = contents.length;

  const { handleTouchEnd, handleTouchMove } = useContentTouchHandlers(
    currentIndex,
    setCurrentIndex,
    entryCount,
  );

  const { handleWheel } = useContentScrollHandlers(setCurrentIndex, entryCount);

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
      const middleIndex = Math.floor(contents.length / 2);
      const adjustedPosition = index - (middleIndex - currentIndex);

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

      item.style.top = `${y}%`;
      item.style.left = `${x}%`;
      item.style.opacity = `${opacity}`;
      item.style.rotate = `${rotation}deg`;
      item.classList.toggle(styles.active, adjustedPosition === 0);
    }
  }, [
    currentIndex,
    showContentList,
    contents.length,
    setSelectedContentId,
    isMobile,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Calculate the actual array index based on currentIndex
      // where currentIndex 0 is the middle item
      const middleIndex = Math.floor(contents.length / 2);
      const actualArrayIndex = middleIndex - currentIndex;

      if (contents[actualArrayIndex]) {
        setSelectedContentId(contents[actualArrayIndex].id);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [setSelectedContentId, currentIndex, contents]);

  // Get the middle x coordinate for the highlight of the active item
  const { x } = getNavCoordinates(0, GAP_BETWEEN_ELEMENTS, RADIUS, isMobile);

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
    >
      {contents.map((element, index) => {
        const { id } = element;
        const name = "title" in element ? element.title : element.name;
        const isStory = isStoryListItem(element);
        // Todo: Add type properties for Video Story and Image Story
        const type = isStory ? "blog" : "layer";

        return (
          <li
            // Used n CSS to get the correct icon for the content type
            data-content-type={type}
            // Used to identify the currently seletected content.
            // Passed to the globe via props to make sure correct actions are triggered
            // E.g. flyTo or show the data layer
            data-content-id={element.id}
            className={cx(styles.contentNavItem)}
            key={index}
            aria-label={`${type} content: ${name}`}
            onClick={() => {
              if (!isStory) {
                dispatch(setShowLayer(false));
                thunkDispatch(layersApi.endpoints.getLayer.initiate(id));
                dispatch(setSelectedLayerIds({ layerId: id, isPrimary: true }));
                trackEvent({
                  category: "datasets",
                  action: "select",
                  name,
                });
              }
            }}
          >
            <Link to={isStory ? `${category}/stories/${id}/0/` : "/data"}>
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
