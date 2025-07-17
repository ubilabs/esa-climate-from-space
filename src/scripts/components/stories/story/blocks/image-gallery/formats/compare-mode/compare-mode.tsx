import { FunctionComponent } from "react";

import { StorySectionProps } from "../../../../../../../types/story";
import { FormatContainer } from "../../../../../layout/format-container/format-container";

import styles from "./compare-mode.module.css";

const CompareMode: FunctionComponent<StorySectionProps> = ({ ref }) => {
  return (
    <FormatContainer className={styles.compareMode} ref={ref}>
      Compare Mode Component
    </FormatContainer>
  );
};

export default CompareMode;
