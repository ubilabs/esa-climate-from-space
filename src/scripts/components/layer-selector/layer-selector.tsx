import React, {FunctionComponent, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {layersSelector} from '../../reducers/layers';
import fetchLayers from '../../actions/fetch-layers';
import {setSelectedLayerIdAction} from '../../actions/set-selected-layer';
import LayerList from '../layer-list/layer-list';
import {Dispatch} from 'redux';
import styles from './layer-selector.styl';

const LayerSelector: FunctionComponent<{}> = () => {
  const layers = useSelector(layersSelector);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchLayers());
  }, []);

  return (
    <div className={styles.layerContainer}>
      {activeTab === 0 ? (
        <LayerList
          layers={layers}
          onSelect={id => dispatch(setSelectedLayerIdAction(id))}
          selected={'layer1'}
        />
      ) : (
        <LayerList
          layers={layers}
          onSelect={id => dispatch(setSelectedLayerIdAction(id))}
          selected={'layer1'}
        />
      )}
    </div>
  );
};

export default LayerSelector;
