import { FunctionComponent } from "react";

import styles from "./frequency-blend.module.css";
import { FormatParallexLayout } from "../../../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../../../types/story";

const FrequencyBlend: FunctionComponent<StorySectionProps> = ({ slideIndex }) => {
  return (
    <FormatParallexLayout className={styles.frequencyBlend} index={slideIndex}>
      Frequency Blend Component
    </FormatParallexLayout>
  );
};

export default FrequencyBlend;
