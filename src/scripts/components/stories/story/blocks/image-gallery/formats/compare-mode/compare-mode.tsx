import  { FunctionComponent } from "react";
import styles from "./compare-mode.module.css";
import { FormatParallexSection } from "../../../block-format-section/block-format-section";

const CompareMode: FunctionComponent = () => {
  return (
    <FormatParallexSection className={styles.compareMode}>Compare Mode Component</FormatParallexSection>
  );
};

export default CompareMode;
