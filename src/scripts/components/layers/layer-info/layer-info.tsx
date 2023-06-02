import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import {LayerListItem} from '../../../types/layer-list';

import styles from './layer-info.module.styl';

interface Props {
  layer: LayerListItem;
}

const LayerInfo: FunctionComponent<Props> = ({layer}) => (
  <div className={styles.layerInfo}>
    <span className={styles.layerType}>{layer.type}</span>
    <h1 className={styles.layerTitle}>{layer.name}</h1>
    <div className={styles.description}>
      {/* eslint-disable-next-line react/no-children-prop */}
      <ReactMarkdown
        children={layer.description}
        linkTarget="_blank"
        rehypePlugins={[rehypeRaw]}
        disallowedElements={[
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
