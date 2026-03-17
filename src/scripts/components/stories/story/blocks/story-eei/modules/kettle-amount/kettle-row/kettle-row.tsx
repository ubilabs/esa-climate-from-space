import { CSSProperties } from "react";
import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount";

import styles from "./kettle-row.module.css";

interface Props {
  index: number;
}

function getInputRangeForIndex(
  index: number,
  itemCount = 8,
  rangeStart = 0.5,
  rangeEnd = 0.6,
): [number, number] {
  if (index < 0 || index >= itemCount) {
    throw new Error(`Index ${index} out of bounds (0–${itemCount - 1})`);
  }

  const totalSpan = rangeEnd - rangeStart;
  const step = totalSpan / itemCount;

  const start = rangeStart + step * index;
  const end = start + step;

  return [start, end] as const;
}

/**
 * Get input range for entry animation with reversed order.
 * Bottom row (index 7) animates first, top row (index 0) animates last.
 */
function getEntryInputRangeForIndex(
  index: number,
  itemCount = 8,
  rangeStart = 0.45,
  rangeEnd = 0.55,
): [number, number] {
  if (index < 0 || index >= itemCount) {
    throw new Error(`Index ${index} out of bounds (0–${itemCount - 1})`);
  }

  // Reverse the index: bottom row (7) gets first range, top row (0) gets last
  const reversedIndex = itemCount - 1 - index;

  const totalSpan = rangeEnd - rangeStart;
  const step = totalSpan / itemCount;

  const start = rangeStart + step * reversedIndex;
  const end = start + step;

  return [start, end] as const;
}

export default function KettleRow({ index }: Props) {
  const { config, scrollYProgress } =
    useScrollModule<KettleAmountAnimationConfig>();

  // Calculate input ranges for entry and exit animations
  const entryInputRange = getEntryInputRangeForIndex(
    index,
    8,
    config.kettleRows.entryRangeStart,
    config.kettleRows.entryRangeEnd,
  );

  const exitInputRange = getInputRangeForIndex(
    index,
    8,
    config.kettleRows.exitRangeStart,
    config.kettleRows.exitRangeEnd,
  );

  // Combine entry and exit animations based on scroll position
  // Before entry: hidden on left (inset 0 0 0 100%)
  // During entry: animate reveal from right to left (bottom row first)
  // Between entry and exit: fully visible (inset 0 0 0 0)
  // During exit: animate hide from left to right (top row first)
  // After exit: hidden on left (inset 0 0 0 100%)
  const clipPath = useTransform(scrollYProgress, (progress) => {
    const [entryStart, entryEnd] = entryInputRange;
    const [exitStart, exitEnd] = exitInputRange;

    if (progress < entryStart) {
      return "inset(0 0 0 100%)"; // Before entry: hidden on left
    } else if (progress >= entryStart && progress <= entryEnd) {
      // During entry: interpolate from hidden to visible with easing
      // Reveals from right to left (left side is clipped, decreasing)
      const entryProgress = (progress - entryStart) / (entryEnd - entryStart);
      // Apply easeInOut manually
      const easedProgress =
        entryProgress < 0.5
          ? 2 * entryProgress * entryProgress
          : 1 - Math.pow(-2 * entryProgress + 2, 2) / 2;
      const leftInset = 100 - easedProgress * 100;
      return `inset(0 0 0 ${leftInset}%)`;
    } else if (progress > entryEnd && progress < exitStart) {
      return "inset(0 0 0 0)"; // Between animations: fully visible
    } else if (progress >= exitStart && progress <= exitEnd) {
      // During exit: interpolate from visible to hidden with easing
      const exitProgress = (progress - exitStart) / (exitEnd - exitStart);
      // Apply easeInOut manually
      const easedProgress =
        exitProgress < 0.5
          ? 2 * exitProgress * exitProgress
          : 1 - Math.pow(-2 * exitProgress + 2, 2) / 2;
      const leftInset = easedProgress * 100;
      return `inset(0 0 0 ${leftInset}%)`;
    } else {
      return "inset(0 0 0 100%)"; // After exit: hidden on left
    }
  });

  return (
    <motion.span
      className={styles.kettleRow}
      style={
        {
          "--grid-row-start": index + 2,
          "--grid-column-start": index === 0 ? 2 : 1,
          clipPath,
        } as unknown as CSSProperties
      }
    ></motion.span>
  );
}
