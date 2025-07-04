import { FunctionComponent } from "react";
import { FormatParallexSection } from "../../../block-format-section/block-format-section";

import styles from "./frequency-blend.module.css";

const FrequencyBlend: FunctionComponent = () => {
  return (
    <FormatParallexSection className={styles.frequencyBlend}>
      Frequency Blend Component
    </FormatParallexSection>
  );
};

export default FrequencyBlend;
