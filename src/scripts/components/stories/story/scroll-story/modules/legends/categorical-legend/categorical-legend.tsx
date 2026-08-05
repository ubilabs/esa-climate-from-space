import { FunctionComponent } from "react";
import { Legend } from "../../../../../../../types/story";
import LegendsWrapper from "../legends-wrapper/legends-wrapper";

import styles from "./categorical-legend.module.css";

interface Props {
  legend: Legend;
}

const CategoricalLegend: FunctionComponent<Props> = ({ legend }) => {
  const { values = [], unit = "", description = "" } = legend;

  return (
    <LegendsWrapper description={description}>
      <figcaption className={styles.legend}>TEST TEST</figcaption>
    </LegendsWrapper>
  );
};

export default CategoricalLegend;
