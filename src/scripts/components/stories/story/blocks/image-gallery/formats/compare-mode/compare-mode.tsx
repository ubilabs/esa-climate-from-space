import React from "react";
import styles from "./compare-mode.module.css";
import { FormatSection } from "../../../block-format-section/block-format-section";

const CompareMode: React.FC = () => {
  return (
    <FormatSection className={styles.compareMode}>Compare Mode Component</FormatSection>
  );
};

export default CompareMode;
