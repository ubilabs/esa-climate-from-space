import { CSSProperties } from "react";
import { motion, useTransform } from "motion/react";
import { useScrollModule } from "../../base-scroll/use-scroll-module";
import { KettleAmountAnimationConfig } from "../kettle-amount-types";
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

export default function KettleRow({ index }: Props) {
  const { config, scrollYProgress } =
    useScrollModule<KettleAmountAnimationConfig>();

  const inputRange = getInputRangeForIndex(
    index,
    8,
    config.kettleRows.rangeStart,
    config.kettleRows.rangeEnd,
  );

  const clipPath = useTransform(scrollYProgress, inputRange, [
    "inset(0 0 0 0)",
    "inset(0% 0% 0% 100%)",
  ]);

  const opacity = useTransform(
    scrollYProgress,
    config.kettleRows.fadeIn.input,
    config.kettleRows.fadeIn.output,
  );

  return (
    <motion.span
      className={styles.kettleRow}
      initial={{ opacity: 0 }}
      style={
        {
          "--grid-row-start": index + 2,
          "--grid-column-start": index === 0 ? 2 : 1,
          clipPath,
          opacity,
        } as unknown as CSSProperties
      }
    ></motion.span>
  );
}
