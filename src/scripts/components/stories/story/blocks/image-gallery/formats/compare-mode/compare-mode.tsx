import { FunctionComponent } from "react";

import { FormatParallaxLayout } from "../../../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../../../types/story";

import styles from "./compare-mode.module.css";

const CompareMode: FunctionComponent<StorySectionProps> = ({ slideIndex }) => {
  return (
    <FormatParallaxLayout className={styles.compareMode} index={slideIndex}>
      Compare Mode Component
    </FormatParallaxLayout>
  );
};

export default CompareMode;
