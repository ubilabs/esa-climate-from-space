import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';

import {LayerListItem} from '../../types/layer-list';

import styles from './layer-info.styl';

interface Props {
  layer: LayerListItem;
}

const LayerInfo: FunctionComponent<Props> = ({layer}) => (
  <div className={styles.layerInfo}>
    <span className={styles.layerType}>Layertype</span>
    <div className={styles.layerTitle}>
      <h1>{layer.name}</h1>
    </div>
    <div className={styles.description}>
      <ReactMarkdown
        source={layer.description}
        linkTarget='_blank'
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
