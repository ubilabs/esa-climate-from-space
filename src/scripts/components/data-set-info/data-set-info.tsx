import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {selectedLayersSelector} from '../../selectors/layers/selected';
import RemoveCompare from '../remove-compare/remove-compare';
import InfoButton from '../info-button/info-button';

import styles from './data-set-info.styl';

interface Props {
  isMain?: boolean;
}

const DataSetInfo: FunctionComponent<Props> = ({isMain}) => {
  const {main, compare} = useSelector(selectedLayersSelector);
  const layer = isMain ? main : compare;

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
