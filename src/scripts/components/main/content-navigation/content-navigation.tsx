import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "./content-navigation.module.css";
import cx from "classnames";
import { getNavCoordinates } from "../../../libs/get-navigation-position";

interface Props {
  showContentList: boolean;
}

// Placeholder content
// Todo: Replace with actual content
const contents = [
  {
    name: "Anomalies du niveau de la mere",
    type: "image",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Bienvenue sur le site Climate from Space With long title",
    type: "layer",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Changement de la couverture des terres",
    type: "image",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Le cycle de l'eau",
    type: "video",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Les glaciers surface",
    type: "blog",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Température de surface de la mer",
    type: "image",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Évolution des forêts",
    type: "layer",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Cycle du carbone",
    type: "video",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Fonte des glaces",
    type: "blog",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Température de l'air with another longer title",
    type: "image",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Changements climatiques",
    type: "layer",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Événements extrêmes",
    type: "video",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
  {
    name: "Biodiversité",
    type: "blog",
    link: "https://cfs.climate.esa.int/index.html#/stories/story-32/0",
  },
];

const ContentNavigation: FunctionComponent<Props> = ({ showContentList }) => {
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
      {contents.map(({ name, type }, index) => {
        const relativePosition = index - Math.floor(contents.length / 2);

        return (
          <li
            // Used in CSS to get the correct icon for the content type
            data-content-type={type}
            // Used in the useEffect to calculate the new position
            data-relative-position={relativePosition}
            className={cx(
              relativePosition === 0 && styles.active,
              styles.contentNavItem,
            )}
            key={index}
          >
            <span>{name}</span>
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
