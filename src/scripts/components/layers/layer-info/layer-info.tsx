import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';

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
        allowedTypes={[
          'heading',
          'text',
          'paragraph',
          'break',
          'strong',
          'emphasis',
          'list',
          'listItem',
          'link'
        ]}
      />
    </div>
  </div>
);

export default LayerInfo;
