import React, {FunctionComponent} from 'react';

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
      <div className={styles.icon}></div>
    </div>
    <p className={styles.description}>
      {layer.description} Placeholder: Lorem ipsum dolor sit amet consectetur
      adipisicing elit.
    </p>
    <p className={styles.description}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto unde
      inventore debitis. Qui iusto laboriosam nam, consectetur veritatis,
      repellendus cumque aliquid consequatur possimus doloremque quo,
      perferendis corporis ratione quod quidem!
    </p>
    <a className={styles.link} href={layer.link}>
      Link to further information
    </a>
  </div>
);

export default LayerInfo;
