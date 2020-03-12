import React, {FunctionComponent} from 'react';
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
import setSelectedLayerIdsAction from '../../actions/set-selected-layer-id';
import {selectedLayerIdsSelector} from '../../selectors/layers/selected-ids';
import {downloadedDataSelector} from '../../selectors/offline/downloaded';
import {downloadProgressSelector} from '../../selectors/offline/progress';

const LayerSelector: FunctionComponent = () => {
  const dispatch = useDispatch();
  const layers = useSelector(layersSelector);
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const showLayerSelector = useSelector(showLayerSelectorSelector);
  const downloadedData = useSelector(downloadedDataSelector);
  const downloadProgress = useSelector(downloadProgressSelector);
  const selectedMainLayer = layers.find(
    layer => layer.id === selectedLayerIds.mainId
  );
  const selectedCompareLayer = layers.find(
    layer => layer.id === selectedLayerIds.compareId
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
              <SelectedLayerListItem layer={selectedMainLayer} />
            )}
            {selectedCompareLayer && (
              <SelectedLayerListItem
                layer={selectedCompareLayer}
                onRemove={() =>
                  dispatch(setSelectedLayerIdsAction(null, false))
                }
              />
            )}
            <LayerList
              layers={layers}
              selectedLayerIds={selectedLayerIds}
              downloadedLayerIds={downloadedData.layers}
              downloadProgress={downloadProgress}
              onSelect={(layerId, isMain) =>
                dispatch(setSelectedLayerIdsAction(layerId, isMain))
              }
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LayerSelector;
