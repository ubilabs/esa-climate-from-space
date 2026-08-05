import { FunctionComponent } from "react";
import { Legend } from "../../../../../../../types/story";
import LegendsWrapper from "../legends-wrapper/legends-wrapper";

import styles from "./continuous-legend.module.css";

interface Props {
  legend: Legend;
}

const ContinuousLegend: FunctionComponent<Props> = ({ legend }) => {
  const { values = [], unit = "", description = "" } = legend;

  return (
    <LegendsWrapper description={description}>
      <figcaption className={styles.legend}>
        <div className={styles.legendMarkers}>
          {values.map(({ value, color }) => (
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
