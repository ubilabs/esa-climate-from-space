import { FunctionComponent } from "react";

import styles from "./frequency-blend.module.css";
import { FormatParallexLayout } from "../../../../../layout/block-format-layout/block-format-section";

const FrequencyBlend: FunctionComponent = () => {
  return (
    <FormatParallexLayout className={styles.frequencyBlend}>
      Frequency Blend Component
    </FormatParallexLayout>
  );
};

export default FrequencyBlend;
