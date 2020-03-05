import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';

import InfoButton from '../info-button/info-button';
import {State} from '../../reducers';
import {layerListItemSelector} from '../../selectors/layers/list-item';
import RemoveCompare from '../remove-compare/remove-compare';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';

import {LayerListItem} from '../../types/layer-list';

import styles from './data-set-info.styl';

interface Props {
  layer: LayerListItem | null;
  isCompare?: boolean;
}

const DataSetContent: FunctionComponent<Props> = ({layer, isCompare}) => (
  <div className={styles.dataSetContent}>
    <h1 className={styles.title}>{layer?.name}</h1>
    <div className={styles.buttons}>
      <InfoButton layer={layer} />
      {isCompare && <RemoveCompare />}
    </div>
  </div>
);

const DataSetInfo: FunctionComponent = () => {
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const {mainId, compareId} = selectedLayerIds;
  const mainLayer = useSelector((state: State) =>
    layerListItemSelector(state, mainId)
  );
  const compareLayer = useSelector((state: State) =>
    layerListItemSelector(state, compareId)
  );

  return (
    <div className={styles.dataSetInfo}>
      <DataSetContent layer={mainLayer} />
      {compareLayer && <DataSetContent layer={compareLayer} isCompare />}
    </div>
  );
};

export default DataSetInfo;
