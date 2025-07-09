import { FunctionComponent } from "react";

import { FormatParallexLayout } from "../../../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../../../types/story";

import styles from "./frequency-blend.module.css";

const FrequencyBlend: FunctionComponent<StorySectionProps> = ({ slideIndex }) => {
  return (
    <FormatParallexLayout className={styles.frequencyBlend} index={slideIndex}>
      Frequency Blend Component
    </FormatParallexLayout>
  );
};

export default FrequencyBlend;
