import React, { FunctionComponent, useEffect, useState } from "react";

import { getNavCoordinates } from "../../../libs/get-navigation-position";

import { StoryList } from "../../../types/story-list";
import { Link } from "react-router-dom";
import {
  useContentScrollHandlers,
  useContentTouchHandlers,
} from "./use-content-event-handlers";

import cx from "classnames";

import styles from "./content-navigation.module.css";
import { FormattedMessage } from "react-intl";

interface Props {
  showContentList: boolean;
  contents: StoryList;
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = contents.length;

  const { handleTouchEnd, handleTouchMove } = useContentTouchHandlers(
    currentIndex,
    setCurrentIndex,
    maxIndex,
  );

  const { handleWheel } = useContentScrollHandlers(setCurrentIndex, maxIndex);

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
    }
  }, [currentIndex, showContentList, setSelectedContentId, isMobile]);

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
  }, [currentIndex, contents]);

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
      {contents.map(({ title, id }, index) => {
        const relativePosition = index - Math.floor(contents.length / 2);
        // Todo: Add type property to StoryList. For now we just take blog
        const type = "blog";
        return (
          <li
            // Used n CSS to get the correct icon for the content type
            data-content-type={type}
            // Used to identify the currently seletected content.
            // Passed to the globe via props to make sure correct actions are triggered
            // E.g. flyTo or show the data layer
            data-content-id={id}
            className={cx(
              relativePosition === 0 && styles.active,
              styles.contentNavItem,
            )}
            key={index}
            aria-label={`${type} content: ${title}`}
          >
            <Link to={`${category}/stories/${id}/0/`}>
              <span>{title}</span>
              {!isMobile && (
                <span
                  className={cx(
                    styles.learnMore,
                    relativePosition === 0 && styles.active,
                  )}
                >
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
