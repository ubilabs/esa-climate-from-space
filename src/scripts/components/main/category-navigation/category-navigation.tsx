import React, {
  FunctionComponent,
  RefObject,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import cx from "classnames";

import { useCategoryTouchHandlers } from "./use-category-event-handlers";

import styles from "./category-navigation.module.css";
import { setSelectedContentAction } from "../../../reducers/content";
import { useDispatch } from "react-redux";

interface Props {
  showCategories: boolean;
  isMobile: boolean;
  width: number;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isAnimationReady: RefObject<boolean>;
  arcs: { [key: string]: number }[];
  currentIndex: number;
  height: number;
}

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
  showCategories,
  arcs,
  isAnimationReady,
  currentIndex,
  setCurrentIndex,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isRotating, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useCategoryTouchHandlers(currentIndex, setCurrentIndex);

  // Control the gap between the lines (arcs)
  const SPACING = 5;

  // Control the thickness of the lines (arcs)
  const LINE_THICKNESS = 14;

  // Calculate the size of the circle navigation
  const _overSize = width * 0.15;

  // Why _oversize? It's because the circle navigation should be bigger than the screen
  // We hide the overflow in the parent container
  const _size = isMobile
    ? width + _overSize
    : // 50% of the screen width minues some padding
      // But capped at the height of the screen minus some padding
      Math.min(width / 2 - 65, height - 120);
  const _radius = _size / 2 - 10;
  const _center = _size / 2;

  // The current navigation state relative to the category-navigation
  const [navigationState, setNavigationState] = useState<
    "forward" | "back" | "none"
  >("none");

  // Listen to history changes
  // This is used to determine the navigation state
  // As the user navigates through the app, we need to trigger different animations
  history.listen((location, action) => {
    if (action === "REPLACE") {
      setNavigationState("none");
    }

    if (action === "PUSH" || action === "POP") {
      if (location.pathname === "/") {
        setNavigationState("back");
      } else {
        setNavigationState("forward");
      }
    }
  });

  // Handle scroll events

  // Calculate proportional distribution
  // There are 360 degrees in a circle and we need to distribute the arcs proportionally
  const totalGapDegrees = SPACING * arcs.length;
  const availableDegrees = 360 - totalGapDegrees;

  const arcValues = arcs.map((arc) => Object.values(arc)[0]);
  const sumOfArcs = arcValues.reduce((sum, angle) => sum + angle, 0);
  const scaleFactor = availableDegrees / sumOfArcs;

  const scaledArcs = arcValues.map((angle) => angle * scaleFactor);

  // This is the arc that is currently selected
  // The problem is that the the user can rotate in any direction, any number of times
  // We calculate the "normalized" index to determine the current arc within the available arcs
  const normalizedIndex =
    ((currentIndex % scaledArcs.length) + scaledArcs.length) %
    scaledArcs.length;

  const angleToCurrentArc = scaledArcs
    .slice(0, normalizedIndex)
    .reduce((sum, angle) => sum + angle + SPACING, 0);

  // Calculate current and target rotation
  const currentRotation = parseFloat(
    document.getElementById("circle-container")?.dataset.currentRotation || "0",
  );

  // Calculate the target rotation to center the current arc
  const targetRotation =
    90 - (angleToCurrentArc + scaledArcs[normalizedIndex] / 2);

  // Normalize rotations to ensure they're within -180 to 180 degrees
  const normalizeAngle = (angle: number) => {
    const normalized = angle % 360;

    return normalized > 180
      ? normalized - 360
      : normalized < -180
        ? normalized + 360
        : normalized;
  };

  // Calculate the shortest rotation path
  const getShortestRotation = (current: number, target: number) => {
    const diff = normalizeAngle(target - current);
    return current + diff;
  };

  // Calculate final rotation offset
  const rotationOffset = getShortestRotation(currentRotation, targetRotation);

  // Calculate the current angle
  // Is updated as we iterate through the arcs to keep track of the end point of the previous arc
  let currentAngle = 0;

  useEffect(() => {
    const [[category]] = Object.entries(arcs[normalizedIndex]);

    if (category) {
      dispatch(setSelectedContentAction({ category }));

      setCategory(category);
    }
  }, [dispatch, normalizedIndex, setCategory, arcs]);

  useEffect(() => {
    if (isAnimationReady.current) {
      return;
    }

    const circleContainer = document.getElementById("circle-container");
    const currentRotation = parseFloat(
      circleContainer?.dataset.currentRotation || "0",
    );

    if (!circleContainer) {
      return;
    }

    circleContainer.style.transform = `rotate(${currentRotation - 15}deg)`;

    setTimeout(() => {
      circleContainer.style.transform = `rotate(${currentRotation}deg)`;
      isAnimationReady.current = true;
    }, 2800);
  }, [isAnimationReady]);

  return (
    <>
      <nav className={styles.chosenCategory}>
        {arcs.map((arc, index) => {
          const [[category, entries]] = Object.entries(arc);
          return (
            <li
              key={category}
              className={cx(
                styles.category,
                index === normalizedIndex && showCategories && styles.active,
              )}
            >
              <FormattedMessage id={`categories.${category}`} />
              <span>
                <FormattedMessage
                  id="entries"
                  values={{
                    count: entries,
                  }}
                />
              </span>
            </li>
          );
        })}
      </nav>

      <div
        className={cx(
          styles["category-navigation"],
          // Apply different classes based on the navigation state
          // And whether the user has come the content- or category-navigation
          navigationState === "none" && styles["reveal-from-left"],
          navigationState === "none" && !showCategories && styles.concealed,
          navigationState === "back" && styles["reveal-from-right"],
          navigationState === "forward" && styles.conceal,
        )}
        aria-label="Circle Navigation"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          className={styles["circle-container"]}
          id="circle-container"
          data-current-rotation={rotationOffset}
          width={_size}
          height={_size}
          viewBox={`0 0 ${_size} ${_size}`}
          style={{
            transform: `rotate(${rotationOffset}deg)`,
          }}
        >
          {/* Each category is an "arc", their share of space is proportional to the number of content they have
          We use SVG to generate the arcs
          */}
          {scaledArcs.map((arcAngle, index) => {
            const endAngle = currentAngle + arcAngle;

            // Convert to radians
            const startRad = (currentAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            // Calculate arc points
            const x1 = _center + _radius * Math.cos(startRad);
            const y1 = _center + _radius * Math.sin(startRad);
            const x2 = _center + _radius * Math.cos(endRad);
            const y2 = _center + _radius * Math.sin(endRad);

            // Create arc path
            const largeArcFlag = arcAngle > 180 ? 1 : 0;
            const pathData = `
              M ${x1} ${y1}
              A ${_radius} ${_radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            `;

            // Update start angle for next arc
            currentAngle = endAngle + SPACING;

            const isCurrentlySelected = index === normalizedIndex;

            const selectedColor = "var(--main)";
            const defaultColor = "var( --dark-grey-5)";

            return (
              <g
                key={index}
                data-index={index}
                className={styles.arc}
                tabIndex={0}
                role="button"
                aria-label={`${Object.keys(arcs[index])[0]} category`}
                aria-selected={isCurrentlySelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCurrentIndex(index);
                  }
                }}
                onClick={() => setCurrentIndex(index)}
                style={{
                  outline: 'none', // Remove default outline
                }}
              >
                <path
                  d={pathData}
                  stroke={
                    isCurrentlySelected && !isRotating
                      ? selectedColor
                      : defaultColor
                  }
                  strokeWidth={LINE_THICKNESS}
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
};

export default CategoryNavigation;
