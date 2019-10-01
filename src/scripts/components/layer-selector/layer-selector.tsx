import React, {FunctionComponent, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {layersSelector} from '../../reducers/layers';
import fetchLayers from '../../actions/fetch-layers';
import {setSelectedLayerIdAction} from '../../actions/set-selected-layer';
import LayerList from '../layer-list/layer-list';
import Tabs from '../tabs/tabs';
import styles from './layer-selector.styl';

const LayerSelector: FunctionComponent<{}> = () => {
  const layers = useSelector(layersSelector);
  const dispatch = useDispatch();
  const tabs = [
    {
      id: 'main',
      label: 'Main'
    },
    {
      id: 'compare',
      label: 'Compare'
    }
  ];

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const isMainTabSelected = activeTabId === tabs[0].id;

  useEffect(() => {
    dispatch(fetchLayers());
  }, []);

  return (
    <div className={styles.layerContainer}>
      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChanged={id => setActiveTabId(id)}
      />
      <LayerList
        layers={layers}
        selected={'layer1'}
        onSelect={id =>
          dispatch(setSelectedLayerIdAction(id, isMainTabSelected))
        }
      />
    </div>
  );
};

export default LayerSelector;
