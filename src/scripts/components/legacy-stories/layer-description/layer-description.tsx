import { FunctionComponent } from "react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

import config from "../../../config/main";
import { markdownComponents } from "../../../libs/markdown-components";

import styles from "./layer-description.module.css";

interface Props {
  layerDescription: string;
}

const LayerDescription: FunctionComponent<Props> = ({ layerDescription }) => (
  <div className={styles.layerDescription}>
    <ReactMarkdown
      children={layerDescription}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
      allowedElements={config.markdownAllowedElements}
    />
  </div>
);

export default LayerDescription;
