import React, { FunctionComponent, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { createPortal } from "react-dom";

import { categoryTags } from "../../../config/main";

import { setSelectedContentAction } from "../../../reducers/content";
import useAutoRotate from "../../../hooks/use-auto-content-rotation";
import { useNavGestures } from "../../../libs/use-nav-gestures";
import { useContentParams } from "../../../hooks/use-content-params";

import styles from "./category-navigation.module.css";

import cx from "classnames";

interface Props {
  isMobile: boolean;
  width: number;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setAnimationReady: React.Dispatch<React.SetStateAction<boolean>>;
  arcs: { [key: string]: number }[];
  height: number;
}

// We reference the SVG container by its ID
const CIRCLE_CONTAINER_ID = "circle-container";

/**
 * A circular navigation component that displays categories in an interactive wheel format.
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.width - The width of the navigation wheel
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setCategory - The function to set the selected category
 * @param {boolean} props.showCategories - Whether to show the categories
 * @param {React.MutableRefObject<boolean>} props.isAnimationReady - A ref to check if the animation is ready
 **/
const CategoryNavigation: FunctionComponent<Props> = ({
  height,
  width,
  isMobile,
  setCategory,
}) => {
  const { category } = useContentParams();
  // Ref to store and control the auto-rotation interval
  const [lastUserInteractionTime, setLastUserInteractionTime] = useState(
    Date.now,
  );
  const dispatch = useDispatch();

  const categoryIndex = category ? categoryTags.indexOf(category) : -1;

  const [currentIndex, setCurrentIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );

  // Custom hook to handle wheel and drag gestures for navigation
  useNavGestures(8, setCurrentIndex, setLastUserInteractionTime, "y", true);

  return (
    <>
      <nav className={styles.chosenCategory}></nav>

      <div
        className={cx(
          styles["category-navigation"],
          styles["reveal-from-left"],
        )}
        aria-label="Circle Navigation"
      ></div>
    </>
  );
};

export default CategoryNavigation;
