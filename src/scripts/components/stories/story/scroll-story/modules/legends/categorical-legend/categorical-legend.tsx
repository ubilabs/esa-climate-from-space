import { CSSProperties, FunctionComponent } from "react";
import { Legend, LegendEntry } from "../../../../../../../types/story";
import LegendsWrapper from "../legends-wrapper/legends-wrapper";

import styles from "./categorical-legend.module.css";

interface Props {
  legend: Legend;
  legendEntries: LegendEntry[];
}

const CategoricalLegend: FunctionComponent<Props> = ({
  legend,
  legendEntries,
}) => {
  const { unit = "", description = "" } = legend;

  return (
    <LegendsWrapper description={description} className={styles.legendWrapper}>
      <figcaption className={styles.legend}>
        <span>{unit}</span>
        {
          <ul className={styles.list}>
            {legendEntries.map(({ value, color }) => (
              <li key={value} className={styles.elementContainer}>
                <span
                  className={styles.color}
                  style={
                    {
                      "--category-color": color,
                    } as CSSProperties
                  }
                ></span>
                <span className={styles.value}>{value}</span>
              </li>
            ))}
          </ul>
        }
      </figcaption>
    </LegendsWrapper>
  );
};

export default CategoricalLegend;
