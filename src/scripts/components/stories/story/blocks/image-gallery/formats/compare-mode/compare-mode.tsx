import { FunctionComponent } from "react";
import styles from "./compare-mode.module.css";
import { FormatParallexLayout } from "../../../../../layout/block-format-layout/block-format-section";
import { StorySectionProps } from "../../../../../../../types/story";

const CompareMode: FunctionComponent<StorySectionProps> = ({ slideIndex }) => {
  return (
    <FormatParallexLayout className={styles.compareMode} index={slideIndex}>
      Compare Mode Component
    </FormatParallexLayout>
  );
};

export default CompareMode;
