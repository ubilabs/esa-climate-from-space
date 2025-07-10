import { FunctionComponent } from "react";

import { FormatParallaxLayout } from "../../../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../../../types/story";

import styles from "./frequency-blend.module.css";

const FrequencyBlend: FunctionComponent<StorySectionProps> = ({ slideIndex }) => {
  return (
    <FormatParallaxLayout className={styles.frequencyBlend} index={slideIndex}>
      Frequency Blend Component
    </FormatParallaxLayout>
  );
};

export default FrequencyBlend;
