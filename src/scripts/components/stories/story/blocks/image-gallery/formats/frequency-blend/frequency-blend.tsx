import { FunctionComponent } from "react";

import { StorySectionProps } from "../../../../../../../types/story";
import { FormatContainer } from "../../../../../layout/format-container/format-container";

import styles from "./frequency-blend.module.css";

const FrequencyBlend: FunctionComponent<StorySectionProps> = ({ ref }) => {
  return (
    <FormatContainer className={styles.frequencyBlend} ref={ref}>
      <div>Frequency Blend Component</div>
    </FormatContainer>
  );
};

export default FrequencyBlend;
