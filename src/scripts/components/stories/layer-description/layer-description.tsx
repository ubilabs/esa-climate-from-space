import React, {FunctionComponent} from 'react';

import styles from './layer-description.styl';

interface Props {
  layerDescription: string;
}

const LayerDescription: FunctionComponent<Props> = ({layerDescription}) => (
  <div className={styles.layerDescription}>{layerDescription}</div>
);

export default LayerDescription;
