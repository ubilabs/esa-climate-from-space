import React, {FunctionComponent} from 'react';
import RemoveCompare from '../remove-compare/remove-compare';
import InfoButton from '../info-button/info-button';

import styles from './data-set-info.styl';
import {LayerListItem} from '../../types/layer-list';

interface Props {
  isMain?: boolean;
  layer: LayerListItem | null;
}

const DataSetInfo: FunctionComponent<Props> = ({layer, isMain}) => {
  return (
    <div className={styles.dataSetInfo}>
      <h1 className={styles.title}>{layer && layer.name}</h1>
      <h2 className={styles.description}>{layer && layer.description}</h2>
      <div className={styles.buttons}>
        <InfoButton layer={layer} />
        {!isMain && <RemoveCompare />}
      </div>
    </div>
  );
};

export default DataSetInfo;
