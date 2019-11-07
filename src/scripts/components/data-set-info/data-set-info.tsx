import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import styles from './data-set-info.styl';
import {selectedLayersSelector} from '../../reducers/layers/selected';

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
    </div>
  );
};

export default DataSetInfo;
