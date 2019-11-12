import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import {selectedLayersSelector} from '../../selectors/layers/selected';
import InfoButton from '../info-button/info-button';

import styles from './data-set-info.styl';

interface Props {
  isMain?: boolean;
}

const DataSetInfo: FunctionComponent<Props> = ({isMain}) => {
  const {main, compare} = useSelector(selectedLayersSelector);

  return (
    <div className={styles.dataSetInfo}>
      <h1 className={styles.title}>
        {isMain ? main && main.name : compare && compare.name}
      </h1>
      <h2 className={styles.description}>
        {isMain ? main && main.description : compare && compare.description}
      </h2>
      <InfoButton layer={main || compare} />
    </div>
  );
};

export default DataSetInfo;
