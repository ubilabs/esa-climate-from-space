import React, { FunctionComponent, useEffect, useState } from "react";

import { getNavCoordinates } from "../../../libs/get-navigation-position";

import { StoryList } from "../../../types/story-list";
import Button from "../button/button";

import cx from "classnames";

import styles from "./content-navigation.module.css";
import { Link } from "react-router-dom";

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
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // The indexDelta is the number of items the user has scrolled
  const [indexDelta, setIndexDelta] = useState(0);

  // The spread between the elements in the circle
  const GAP_BETWEEN_ELEMENTS = 16;

  // The radius of the circle. We use a fixed radius here from
  // 0 - 100 because the coordinates are used as the top and left values
  // in a absolute positioned element. The advantage here is that the the elements
  // will automatically positioned and re-positioned based on the size of the parent container
  const RADIUS = 40;

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) {
      setTouchStartY(e.touches[0].clientY);
      return;
    }

    const touchDelta = e.touches[0].clientY - touchStartY;

    const itemHeight = 32; // Height of each item in pixels
    const sensitivity = 0.5; // Adjust this to control movement sensitivity

    const delta = Math.round((touchDelta * sensitivity) / itemHeight);

    if (delta !== indexDelta) {
      setIndexDelta(delta);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    console.log("touchStartY", touchStartY);
    setTouchStartY(null);
  };

  // Every item will be repositioned based on the new indexDelta
  useEffect(() => {
    const listItems = document.querySelectorAll(
      "ul li",
    ) as NodeListOf<HTMLElement>;
    // if at last of first item, we prevent any further scrolling
    const listItemsLength = listItems.length - 1;
    console.log("listItemsLength", listItemsLength);

    // Check if the first item has a relativePosition of 0 or the last item has a relativePosition of listItemsLength
    const firstItemRelativePosition = Number(
      listItems[0]?.getAttribute("data-relative-position"),
    );
    const lastItemRelativePosition = Number(
      listItems[listItems.length - 1]?.getAttribute("data-relative-position"),
    );

    // This prevents any scrolling beyond the last and first list item
    if (
      (firstItemRelativePosition === 0 && indexDelta > 0) ||
      (lastItemRelativePosition === 0 && indexDelta < 0)
    ) {
      return;
    }

    for (const item of listItems) {
      const relativePosition = Number(
        item.getAttribute("data-relative-position"),
      );

      if (relativePosition === 0) {
        const id = item.getAttribute("data-content-id");
        if (!id) {
          console.warn(
            "Selected content does not have an id. This should not be the case",
          );
        } else if (!touchStartY) {
          setSelectedContentId(id);
        }
      }

      const adjustedPosition = relativePosition + indexDelta;

      const { x, y } = getNavCoordinates(
        adjustedPosition,
        GAP_BETWEEN_ELEMENTS,
        RADIUS,
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

      item.setAttribute("data-relative-position", adjustedPosition.toString());
    }
  }, [touchStartY, indexDelta, showContentList, setSelectedContentId]);

  // Get the middle x coordinate for the highlight of the active item
  const { x } = getNavCoordinates(0, GAP_BETWEEN_ELEMENTS, RADIUS);

  return (
    <ul
      className={cx(
        styles.contentNav,
        showContentList && styles.show,
        className,
      )}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        transform: !isMobile ? `translateX(-${RADIUS}%)` : undefined,
      }}
    >
      {contents.map(({ title, id }, index) => {
        const relativePosition = index - Math.floor(contents.length / 2);
        // Todo: Add type property to StoryList. For now we just take blog
        const type = "blog";
        return (
          <li
            // Used in CSS to get the correct icon for the content type
            data-content-type={type}
            // Used in the useEffect to calculate the new position
            data-relative-position={relativePosition}
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
            </Link>
          </li>
        );
      })}
      {/* This is the highlight of the currently selected item.
      It serves a visual purpose only */}
      <span
        aria-hidden="true"
        style={{
       // The 8px or 24px is what the offset of the highlight to the left
          left: `calc(${x}% - ${isMobile ? "8" : "24"}px)`,
        }}
      ></span>
    </ul>
  );
};

export default ContentNavigation;
