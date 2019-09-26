import React, {FunctionComponent, useEffect, useState} from 'react';
import {Dispatch} from 'redux';

import {useSelector, useDispatch} from 'react-redux';
import {layersSelector} from '../../reducers/layers';
import fetchLayers from '../../actions/fetch-layers';
import {setSelectedLayerIdAction} from '../../actions/set-selected-layer';
import {setActiveTabSelector} from '../../reducers/active-tab';
import LayerList from '../layer-list/layer-list';
import Tabs from '../tabs/tabs';
import styles from './layer-selector.styl';

const LayerSelector: FunctionComponent<{}> = () => {
  const layers = useSelector(layersSelector);
  const activeTab = useSelector(setActiveTabSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLayers());
  }, []);

  return (
    <div className={styles.layerContainer}>
      <Tabs />
      {activeTab === 'main' ? (
        <LayerList
          layers={layers}
          onSelect={id => dispatch(setSelectedLayerIdAction(id))}
          selected={'layer1'}
        />
      ) : (
        <LayerList
          layers={layers}
          onSelect={id => dispatch(setSelectedLayerIdAction(id))}
          selected={'layer2'}
        />
      )}
    </div>
  );
};

export default LayerSelector;
