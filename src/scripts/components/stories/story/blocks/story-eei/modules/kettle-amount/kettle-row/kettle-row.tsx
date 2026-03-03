import { CSSProperties } from "react";
import styles from "./kettle-row.module.css";
import { motion, MotionValue, useTransform } from "motion/react";

interface Props {
  index: number;
  progress: MotionValue;
}

function getInputRangeForIndex(
  index: number,
  itemCount = 8,
  rangeStart = 0.3,
  rangeEnd = 0.5,
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

export default function KettleRow({ index, progress }: Props) {
  const inputRange = getInputRangeForIndex(index);

  const clipPath = useTransform(progress, inputRange, [
    "inset(0 0 0 0)",
    "inset(0% 0% 0% 100%)",
  ]);

  return (
    <motion.span
      className={styles.kettleRow}
      style={
        {
          "--grid-row-start": index + 2,
          "--grid-column-start": index === 0 ? 2 : 1,
          clipPath: clipPath,
        } as unknown as CSSProperties
      }
    ></motion.span>
  );
}
