import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { LayerListItem } from "../../../types/layer-list";
import config from "../../../config/main";

import styles from "./layer-info.module.css";

interface Props {
  layer: LayerListItem;
}

const LayerInfo: FunctionComponent<Props> = ({ layer }) => (
  <div className={styles.layerInfo}>
    <span className={styles.layerType}>{layer.type}</span>
    <h1 className={styles.layerTitle}>{layer.name}</h1>
    <div className={styles.description}>
      <ReactMarkdown
        children={layer.description}
        rehypePlugins={[rehypeRaw]}
        allowedElements={config.markdownAllowedElements}
      />
      {layer.usageInfo && <p>{layer.usageInfo}</p>}
    </div>
  </div>
);

export default LayerInfo;
