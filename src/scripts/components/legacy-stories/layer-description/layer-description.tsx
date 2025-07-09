import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

import config from "../../../config/main";

import styles from "./layer-description.module.css";

interface Props {
  layerDescription: string;
}

const LayerDescription: FunctionComponent<Props> = ({ layerDescription }) => (
  <div className={styles.layerDescription}>
    <ReactMarkdown
      children={layerDescription}
      linkTarget="_blank"
      allowedElements={config.markdownAllowedElements}
    />
  </div>
);

export default LayerDescription;
