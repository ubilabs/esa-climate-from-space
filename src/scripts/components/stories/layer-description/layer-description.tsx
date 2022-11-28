import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';

import styles from './layer-description.module.styl';

interface Props {
  layerDescription: string;
}

const LayerDescription: FunctionComponent<Props> = ({layerDescription}) => (
  <div className={styles.layerDescription}>
    <ReactMarkdown
      children={layerDescription}
      linkTarget="_blank"
      allowedElements={[
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
