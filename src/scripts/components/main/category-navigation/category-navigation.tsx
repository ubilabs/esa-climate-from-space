import React, {
  FunctionComponent,
  RefObject,
  useEffect,
  useState,
} from "react";

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
  isAnimationReady: RefObject<boolean>;
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
  arcs,
  isAnimationReady,
}) => {
  const { category } = useContentParams();
  // Ref to store and control the auto-rotation interval
  const [lastUserInteractionTime, setLastUserInteractionTime] = useState(
    Date.now(),
  );
  const dispatch = useDispatch();

  const categoryIndex = category ? categoryTags.indexOf(category) : -1;

  const [currentIndex, setCurrentIndex] = useState(
    categoryIndex !== -1 ? categoryIndex : 0,
  );

  // Custom hook to handle wheel and drag gestures for navigation
  useNavGestures(
    arcs.length,
    setCurrentIndex,
    setLastUserInteractionTime,
    "x",
    true,
  );

  // State to control the tooltip visibility and position. The tooltip the currently hovered or focused category
  const [tooltipInfo, setTooltipInfo] = useState<{
    // Stores information about the currently hovered or focused category
    index: number;
    visible: boolean;
    x?: number;
    y?: number;
  }>({ index: -1, visible: false });

  // Control the gap between the lines (arcs)
  const SPACING = 5;

  // Control the thickness of the lines (arcs)
  const LINE_THICKNESS = 14;

  // Calculate the size of the circle navigation
  const _overSize = width * 0.15;

  // Why _oversize? It's because the circle navigation should be bigger than the screen
  // We hide the overflow in the parent container
  const _size = isMobile ? width + _overSize : Math.min(width / 2, height - 60);

  const _radius = _size / 2 - 10;
  const _center = _size / 2;

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
    document.getElementById(CIRCLE_CONTAINER_ID)?.dataset.currentRotation ||
      "0",
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
  const rotationOffset =
    getShortestRotation(currentRotation, targetRotation) - (isMobile ? 0 : 90);

  // Handle showing tooltip for both mouse events and keyboard focus
  const handleShowTooltip = (
    e: React.MouseEvent | React.FocusEvent,
    index: number,
  ) => {
    const svgRect = document
      .getElementById(CIRCLE_CONTAINER_ID)
      ?.getBoundingClientRect();

    if (svgRect) {
      // For mouse events, use cursor position
      // For focus events, use element position
      if ("clientX" in e) {
        // Mouse event
        setTooltipInfo({
          index,
          visible: true,
          x: e.clientX,
          y: e.clientY,
        });
      } else {
        // Focus event
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();

        setTooltipInfo({
          index,
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }
    }
  };

  // Handle hiding tooltip
  const handleHideTooltip = () => setTooltipInfo({ index: -1, visible: false });
  // Calculate the current angle
  // Is updated as we iterate through the arcs to keep track of the end point of the previous arc
  let currentAngle = 0;

  // Auto initialize auto-rotation on user inactivity
  useAutoRotate({
    lastUserInteractionTime,
    setCurrentIndex,
    itemsLength: arcs.length,
    isAnimationReady,
  });

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

    const circleContainer = document.getElementById(CIRCLE_CONTAINER_ID);
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
                index === normalizedIndex && styles.active,
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
          styles["reveal-from-left"],
        )}
        aria-label="Circle Navigation"
      >
        {tooltipInfo.visible &&
          !isMobile &&
          tooltipInfo.x !== undefined &&
          tooltipInfo.y !== undefined &&
          // We create a portal to render the tooltip on the body
          // We do this to avoid z-index and stacking context issues
          // The tooltip position x and y values are set to the cursor position
          createPortal(
            <div
              className={styles.tooltip}
              style={{
                position: "fixed", // Changed from absolute to fixed since we're in document.body
                left: `${tooltipInfo.x}px`,
                top: `${tooltipInfo.y}px`,
                transform: "translate(-50%, -110%)", // Center horizontally and position above the point
              }}
              role="tooltip"
            >
              {(() => {
                const categoryKey = Object.keys(arcs[tooltipInfo.index])[0];
                return <FormattedMessage id={`categories.${categoryKey}`} />;
              })()}
            </div>,
            document.body,
          )}

        <svg
          id={CIRCLE_CONTAINER_ID}
          className={styles[CIRCLE_CONTAINER_ID]}
          width={_size}
          height={_size}
          viewBox={`0 0 ${_size} ${_size}`}
          style={{
            transform: `rotate(${rotationOffset}deg)`,
            transition: "transform 0.5s ease-out",
          }}
          data-current-rotation={rotationOffset}
          aria-hidden="true"
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLastUserInteractionTime(Date.now());
                    setCurrentIndex(index);
                  }
                }}
                onClick={() => {
                  if (!isMobile) {
                    setLastUserInteractionTime(Date.now());
                    setCurrentIndex(index);
                  }
                }}
                onMouseEnter={(e) => handleShowTooltip(e, index)}
                onMouseLeave={handleHideTooltip}
                onFocus={(e) => handleShowTooltip(e, index)}
                onBlur={handleHideTooltip}
              >
                <path
                  d={pathData}
                  stroke={isCurrentlySelected ? selectedColor : defaultColor}
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
