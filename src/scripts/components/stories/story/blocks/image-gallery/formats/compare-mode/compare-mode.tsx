import  { FunctionComponent } from "react";
import styles from "./compare-mode.module.css";
import { FormatParallexLayout } from "../../../../../layout/block-format-layout/block-format-section";

const CompareMode: FunctionComponent = () => {
  return (
    <FormatParallexLayout className={styles.compareMode}>Compare Mode Component</FormatParallexLayout>
  );
};

export default CompareMode;
