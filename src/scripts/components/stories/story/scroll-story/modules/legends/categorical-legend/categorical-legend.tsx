import { CSSProperties, FunctionComponent } from "react";
import { Legend } from "../../../../../../../types/story";
import LegendsWrapper from "../legends-wrapper/legends-wrapper";

import styles from "./categorical-legend.module.css";

interface Props {
  legend: Legend;
}

const CategoricalLegend: FunctionComponent<Props> = ({ legend }) => {
  const { values = [], unit = "", description = "" } = legend;

  return (
    <LegendsWrapper description={description} className={styles.legendWrapper}>
      <figcaption className={styles.legend}>
        <span>{unit}</span>
        {
          <ul className={styles.list}>
            {values.map((entry) => {
              const key = Object.keys(entry)[0] as keyof typeof entry;
              return (
                <li className={styles.elementContainer}>
                  <span
                    className={styles.color}
                    style={
                      {
                        "--category-color": key,
                      } as CSSProperties
                    }
                  ></span>
                  <span className={styles.value}>{entry[key]}</span>
                </li>
              );
            })}
          </ul>
        }
      </figcaption>
    </LegendsWrapper>
  );
};

export default CategoricalLegend;
