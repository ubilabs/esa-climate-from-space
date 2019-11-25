import React, {FunctionComponent, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIntl} from 'react-intl';
import {useParams} from 'react-router-dom';

import {layersSelector} from '../../selectors/layers/list';
import {LayersIcon} from '../icons/layers-icon';
import {CompareIcon} from '../icons/compare-icon';
import LayerList from '../layer-list/layer-list';
import Tabs from '../tabs/tabs';

import {Tab} from '../../types/tab';

import styles from './layer-selector.styl';

const LayerSelector: FunctionComponent = () => {
  const intl = useIntl();
  const layers = useSelector(layersSelector);
  const {mainLayerId} = useParams();
  const tabs: Tab[] = [
    {
      id: 'main',
      label: intl.formatMessage({id: 'layerSelector.main'}),
      icon: LayersIcon
    },
    {
      id: 'compare',
      label: intl.formatMessage({id: 'layerSelector.compare'}),
      icon: CompareIcon
    }
  ];

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const isMainTabSelected = activeTabId === tabs[0].id;

  const onTabClick = (id: string) => {
    if (id === 'main') {
      setActiveTabId(id);
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
    }
    if (mainLayerId) {
      setActiveTabId(id);
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
    }

    if (activeTabId === id) {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.layerContainer}>
      <Tabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChanged={id => onTabClick(id)}
      />
      {isOpen && <LayerList isMain={isMainTabSelected} layers={layers} />}
    </div>
  );
};

export default LayerSelector;
