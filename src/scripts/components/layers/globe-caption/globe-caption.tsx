import { FunctionComponent } from "react";
import styles from "./globe-caption.module.css";

interface Props {
  caption: string;
}

const GlobeCaption: FunctionComponent<Props> = ({ caption }) => {
  return <div className={styles.globeCaption}>{caption}</div>;
};

export default GlobeCaption;
