import React, { FunctionComponent, useEffect, useState } from "react";

import { getNavCoordinates } from "../../../libs/get-navigation-position";

import { StoryList } from "../../../types/story-list";
import Button from "../button/button";

import cx from "classnames";

import styles from "./content-navigation.module.css";

interface Props {
  showContentList: boolean;
  contents: StoryList;
  setSelectedContentId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ContentNavigation: FunctionComponent<Props> = ({
  showContentList,
  contents,
  setSelectedContentId,
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
  const RADIUS = 33;

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
    setTouchStartY(null);
  };

  useEffect(() => {
    return () => {
      console.log("unmounting");
    };
  }, []);

  // This effect will be triggered whenever the indexDelta changes, i.e. when the user scrolls
  // Every item will be repositioned based on the new indexDelta
  useEffect(() => {
    const listItems = document.querySelectorAll(
      "ul li",
    ) as NodeListOf<HTMLElement>;

    for (const item of listItems) {
      const relativePosition = Number(
        item.getAttribute("data-relative-position"),
      );

      if (relativePosition === 0) {
        const id = item.getAttribute("data-content-id");

        if (!id) {
          console.warn(
            "Selected content does not have an idea. This should not be the case",
          );
        }
        setSelectedContentId(id);
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
  }, [indexDelta, showContentList]);

  // Get the middle x coordinate for the highlight of the active item
  const { x } = getNavCoordinates(0, GAP_BETWEEN_ELEMENTS, RADIUS);

  return (
    <ul
      className={cx(styles.contentNav, showContentList && styles.show)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
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
            <Button link={`stories/${id}/0/`} label={title}></Button>
          </li>
        );
      })}
      {/* This is the highlight of the currently selected item.
      It serves a visual purpose only */}
      <span
        aria-hidden="true"
        style={{
          left: `calc(${x}% - 8px)`,
        }}
      ></span>
    </ul>
  );
};

export default ContentNavigation;
