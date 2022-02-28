import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown/with-html';

import {LayerListItem} from '../../../types/layer-list';

import styles from './layer-info.styl';

interface Props {
  layer: LayerListItem;
}

const LayerInfo: FunctionComponent<Props> = ({layer}) => (
  <div className={styles.layerInfo}>
    <span className={styles.layerType}>{layer.type}</span>
    <h1 className={styles.layerTitle}>{layer.name}</h1>
    <div className={styles.description}>
      <ReactMarkdown
        source={layer.description}
        linkTarget="_blank"
        escapeHtml={false}
        allowedTypes={[
          'heading',
          'text',
          'paragraph',
          'break',
          'strong',
          'emphasis',
          'list',
          'listItem',
          'link',
          'html'
        ]}
      />
      {layer.usageInfo && <p>{layer.usageInfo}</p>}
    </div>
  </div>
);

export default LayerInfo;
