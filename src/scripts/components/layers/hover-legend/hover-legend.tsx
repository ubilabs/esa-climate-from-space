import { FunctionComponent, useState } from "react";
import cx from "classnames";

import { LegendValueColor } from "../../../types/legend-value-color";

import styles from "./hover-legend.module.css";

interface Props {
  values: LegendValueColor[];
  isCompare?: boolean;
}

const HoverLegend: FunctionComponent<Props> = ({ values, isCompare }) => {
  const [legendValue, setLegendValue] = useState("");

  return (
    <div className={cx(styles.hoverLegend, isCompare && styles.rightSided)}>
      {values.map((legendItem, index) => (
        <div className={styles.legendItem} key={index}>
          <div
            className={styles.color}
            style={{ backgroundColor: legendItem.color }}
            onMouseOver={() => setLegendValue(legendItem.value)}
            onFocus={() => setLegendValue(legendItem.value)}
            onMouseLeave={() => setLegendValue("")}
            onBlur={() => setLegendValue("")}
          ></div>
          {legendValue === legendItem.value && (
            <span className={styles.hoverValue}>{legendValue}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default HoverLegend;
