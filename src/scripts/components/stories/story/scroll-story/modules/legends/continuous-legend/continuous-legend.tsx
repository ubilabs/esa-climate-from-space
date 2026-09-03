import { FunctionComponent } from "react";
import { Legend, LegendEntry } from "../../../../../../../types/story";
import LegendsWrapper from "../legends-wrapper/legends-wrapper";

import styles from "./continuous-legend.module.css";

interface Props {
  legend: Legend;
  legendEntries: LegendEntry[];
}

const ContinuousLegend: FunctionComponent<Props> = ({
  legend,
  legendEntries,
}) => {
  const { unit = "", description = "" } = legend;

  return (
    <LegendsWrapper description={description}>
      <figcaption className={styles.legend}>
        <div className={styles.legendMarkers}>
          {legendEntries.map(({ value, color }) => (
            <div key={value} className={styles.legendMarker}>
              <span
                className={styles.dot}
                style={{ backgroundColor: color }}
                title={String(value)}
              />
              {value !== null && <span className={styles.value}>{value}</span>}
            </div>
          ))}
        </div>
        <span className={styles.unit}>{unit}</span>
      </figcaption>
    </LegendsWrapper>
  );
};

export default ContinuousLegend;
