import { FunctionComponent } from "react";
import { TimeRange } from "../../../types/time-range";

import styles from "./time-slider-range.module.css";

interface Props {
  range: TimeRange;
  combined: TimeRange;
  selectedTimeIndex: number;
}

const TimeSliderRange: FunctionComponent<Props> = ({
  range,
  combined,
  selectedTimeIndex,
}) => {
  const totalRange = combined.max - combined.min;
  const left = Math.round(((range.min - combined.min) / totalRange) * 100);
  const right =
    100 - Math.round(((range.max - combined.min) / totalRange) * 100);
  const rangeStyle = {
    left: `${left}%`,
    right: `${right}%`,
  };

  const getTickStyle = (timestamp: string, isSelected: boolean) => {
    const tickPosition =
      ((Date.parse(timestamp) - range.min) / (range.max - range.min)) * 100;

    return {
      left: `${tickPosition}%`,
      backgroundColor: isSelected ? "var(--main)" : undefined,
      transform: isSelected ? "translate(-50%, 1px) scale(3)" : undefined,
    };
  };

  return (
    <div className={styles.track}>
      <div className={styles.range} style={rangeStyle}>
        {range.timestamps.map((timestamp, index) => (
          <div
            key={timestamp}
            className={styles.tick}
            style={getTickStyle(timestamp, index === selectedTimeIndex)}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSliderRange;
