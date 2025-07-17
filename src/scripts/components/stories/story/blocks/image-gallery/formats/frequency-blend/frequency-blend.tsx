import { FunctionComponent } from "react";

import { StorySectionProps } from "../../../../../../../types/story";

import styles from "./frequency-blend.module.css";
import { FormatContainer } from "../../../../../layout/format-container/format-container";

const FrequencyBlend: FunctionComponent<StorySectionProps> = ({ ref }) => {
  return (
    <FormatContainer className={styles.frequencyBlend} ref={ref}>
      <div>Frequency Blend Component</div>
    </FormatContainer>
  );
};

export default FrequencyBlend;
