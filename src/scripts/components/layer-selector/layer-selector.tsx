import React, {FunctionComponent, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {motion, AnimatePresence} from 'framer-motion';
import {showLayerSelector as showLayerSelectorSelector} from '../../selectors/show-layer-selector';

import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';
import showLayerSelectorAction from '../../actions/show-layer-selector';
import LayerList from '../layer-list/layer-list';
import SelectedLayerListItem from '../selected-layer-list-item/selected-layer-list-item';
import {layersSelector} from '../../selectors/layers/list';

import styles from './layer-selector.styl';

const LayerSelector: FunctionComponent = () => {
  const dispatch = useDispatch();
  const layers = useSelector(layersSelector);
  const showLayerSelector = useSelector(showLayerSelectorSelector);
  const [selectedMainId, setSelectedMainId] = useState<string | null>('clouds');
  const [selectedCompareId, setSelectedCompareId] = useState<string | null>();
  const selectedIds = [selectedMainId, selectedCompareId].filter(
    Boolean
  ) as string[];
  const selectedMainLayer = layers.find(layer => layer.id === selectedMainId);
  const selectedCompareLayer = layers.find(
    layer => layer.id === selectedCompareId
  );

  return (
    <AnimatePresence>
      {showLayerSelector ? (
        <motion.div
          className={styles.layerSelector}
          initial={{x: '100%'}}
          animate={{x: 0}}
          transition={{type: 'spring', damping: 300, ease: 'easeOut'}}
          exit={{x: '100%'}}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                <FormattedMessage id={'layers'} />
              </h1>
              <Button
                className={styles.button}
                icon={CloseIcon}
                onClick={() => {
                  dispatch(showLayerSelectorAction(false));
                }}
              />
            </div>
            {selectedMainLayer && (
              <SelectedLayerListItem
                layer={selectedMainLayer}
                onRemove={() => setSelectedMainId(null)}
              />
            )}
            {selectedCompareLayer && (
              <SelectedLayerListItem
                showRemoveButton
                layer={selectedCompareLayer}
                onRemove={() => setSelectedCompareId(null)}
              />
            )}
            <LayerList
              layers={layers}
              selectedIds={selectedIds}
              onMainSelect={layerId => setSelectedMainId(layerId)}
              onCompareSelect={layerId => setSelectedCompareId(layerId)}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LayerSelector;
