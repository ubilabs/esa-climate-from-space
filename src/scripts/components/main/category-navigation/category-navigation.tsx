import React, {useEffect, useState} from 'react';

import styles from './category-navigation.module.css';

interface Props {
  width: number;
}

const CategoryNavigation: React.FC<Props> = ({width}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log('🚀 ~ currentIndex:', currentIndex);
  const [isRotating, setIsRotating] = useState(false);

  const [isAnimating, setIsAnimating] = useState(true);

  const overSize = 50;

  const size = width + overSize;
  const radius = size / 2 - 10;
  const center = size / 2;
  const gapInDegrees = 5;
  const strokeWidth = 14;

  useEffect(() => {
    // Start animation after component mount
    console.log('test');
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 10);
    return () => clearTimeout(timer);
  }, []);

  // Arc and color configuration
  //   const arcs = [20, 21, 60, 50, 40, 10, 80];
  const arcs = [
    {'Sea Surface Temperature': 20},
    {'Chlorophyll Concentration': 21},
    {'Water Vapour': 60},
    {'Sea Surface Salinity': 50},
    {Highlights: 40},
    {'Ice Sheets': 10},
    {Permafrost: 80},
    {Landcover: 12},
    {'Greenhouse Gases': 30}
  ];

  // Find largest arc and its index
  // const maxArc = Math.max(...arcs);
  // const maxArcIndex = arcs.indexOf(maxArc);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) {
      // Remove modulo, allow continuous rotation
      const direction = diff > 0 ? -1 : 1;
      const nextIndex = currentIndex + direction;

      setCurrentIndex(nextIndex);

      // if (nextIndex < 0) {
      //   setCurrentIndex(arcs.length - 1);
      // } else if (nextIndex >= arcs.length) {
      //   setCurrentIndex(0);
      // } else {
      //   setCurrentIndex(nextIndex);
      // }

      setTouchStart(null);
      setIsRotating(true);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setIsRotating(false);
  };

  // Calculate proportional distribution

  const totalGapDegrees = gapInDegrees * arcs.length;
  const availableDegrees = 360 - totalGapDegrees;

  const arcValues = arcs.map(arc => Object.values(arc)[0]);
  const sumOfArcs = arcValues.reduce((sum, angle) => sum + angle, 0);
  const scaleFactor = availableDegrees / sumOfArcs;
  // const scaledArcs = arcs;

  const scaledArcs = arcValues.map(angle => angle * scaleFactor);
  // // Center the largest arc at 270 degrees (bottom)
  // const rotationOffset =
  //   90 - (angleToLargestArc + scaledArcs[maxArcIndex] / 2);

  // Calculate rotation offset with bounds checking
  // const safeCurrentIndex =
  //   ((currentIndex % scaledArcs.length) + scaledArcs.length) %
  //   scaledArcs.length;

  const normalizedIndex =
    ((currentIndex % scaledArcs.length) + scaledArcs.length) %
    scaledArcs.length;

  const angleToCurrentArc = scaledArcs
    .slice(0, normalizedIndex)
    .reduce((sum, angle) => sum + angle + gapInDegrees, 0);

  // Calculate current and target rotation
  const currentRotation = parseFloat(
    document.getElementById('circle-container')?.dataset.currentRotation || '0'
  );

  let targetRotation =
    90 - (angleToCurrentArc + scaledArcs[normalizedIndex] / 2);

  // Normalize current rotation to be between 0 and 360
  const normalizedCurrentRotation = ((currentRotation % 360) + 360) % 360;
  const normalizedTargetRotation = ((targetRotation % 360) + 360) % 360;

  // Calculate both clockwise and counterclockwise differences
  const clockwiseDiff = normalizedTargetRotation - normalizedCurrentRotation;
  const counterclockwiseDiff =
    clockwiseDiff > 0 ? clockwiseDiff - 360 : clockwiseDiff + 360;

  // Choose the smaller rotation
  targetRotation =
    currentRotation +
    (Math.abs(clockwiseDiff) < Math.abs(counterclockwiseDiff)
      ? clockwiseDiff
      : counterclockwiseDiff);

  const rotationOffset = targetRotation;

  // console.log('🚀 ~ test:', 90 - (angleToCurrentArc + 28.17391304347826 / 2));
  let startAngle = 0;

  // Calculate rotation based on continuous index
  // const degreesPerArc = 360 / scaledArcs.length;
  // const baseRotation = currentIndex * degreesPerArc;

  // Calculate total rotation based on current index
  // const baseRotation = currentIndex * (360 / scaledArcs.length);

  console.log(
    'Object.values(arcs).find((entry, index) => index === normalizedIndex)',
    // Object.values(arcs).find((entry, index) => index === normalizedIndex)
    Object.entries(arcs).find((entry, index) => index === normalizedIndex)[1]
  );

  return (
    <>
      <div className={styles.chosenCategory}>
        <div>test</div>
        <span>{normalizedIndex}</span>
      </div>

      <nav
        aria-label="Circle Navigation"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={styles['category-navigation']}
        style={{
          zIndex: '1',
          overscrollBehavior: 'contain',
          // marginLeft: `-${overSize / 2}px`,
          overflow: 'hidden',
          height: `${size / 2}px`
        }}>
        <svg
          id="circle-container"
          data-current-rotation={rotationOffset}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            translate: ' 0 -50%',
            transition: isRotating ? 'transform 0.3s ease-out' : 'none',
            transform: `rotate(${rotationOffset}deg)`
          }}>
          {scaledArcs.map((arcAngle, index) => {
            // Calculate end angle with gap consideration

            //       Start with offset
            // let startAngle = gapInDegrees / 2 + rotationOffset;
            const endAngle = startAngle + arcAngle;

            // Convert to radians
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            // Calculate arc points
            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            // Create arc path
            const largeArcFlag = arcAngle > 180 ? 1 : 0;
            const pathData = `
              M ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            `;

            // Update start angle for next arc
            startAngle = endAngle + gapInDegrees;

            const isCurrentlySelected = index === normalizedIndex;

            const selectedColor = 'rgba(0, 179, 152, 1)';
            const defaultColor = 'rgba(0, 51, 73, 1)';

            return (
              <g key={index} data-index={index}>
                <path
                  d={pathData}
                  stroke={
                    isCurrentlySelected && !isRotating
                      ? selectedColor
                      : defaultColor
                  }
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    strokeDasharray: '1000',
                    strokeDashoffset: isAnimating ? '-1000' : '0',
                    transition: `stroke-dashoffset 1s ease-out ${
                      Math.abs(4 - index) * 0.1
                    }s, stroke 0.3s ease-in-out`
                  }}
                />
              </g>
            );
          })}
        </svg>
      </nav>
    </>
  );
};

export default CategoryNavigation;
