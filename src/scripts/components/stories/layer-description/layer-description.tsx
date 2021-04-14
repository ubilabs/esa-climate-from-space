import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './layer-description.styl';

interface Props {
  layerDescription: string;
}

const LayerDescription: FunctionComponent<Props> = ({layerDescription}) => (
  <div className={styles.layerDescription}>
    <ReactMarkdown
      source={layerDescription}
      linkTarget="_blank"
      allowedTypes={[
        'heading',
        'text',
        'paragraph',
        'break',
        'strong',
        'emphasis'
      ]}
    />
  </div>
);

export default LayerDescription;
