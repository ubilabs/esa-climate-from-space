import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {motion, AnimatePresence} from 'framer-motion';

import {showLayerSelector as showLayerSelectorSelector} from '../../../selectors/show-layer-selector';
import Button from '../../main/button/button';
import {CloseIcon} from '../../main/icons/close-icon';
import showLayerSelectorAction from '../../../actions/show-layer-selector';
import LayerList from '../layer-list/layer-list';
import SelectedLayerListItem from '../selected-layer-list-item/selected-layer-list-item';
import {layersSelector} from '../../../selectors/layers/list';
import {selectedLayerIdsSelector} from '../../../selectors/layers/selected-ids';
import setSelectedLayerIdsAction from '../../../actions/set-selected-layer-id';
import {layerDetailsSelector} from '../../../selectors/layers/layer-details';
import {State} from '../../../reducers';
import setFlyToAction from '../../../actions/set-fly-to';

import styles from './layer-selector.styl';

const LayerSelector: FunctionComponent = () => {
  const dispatch = useDispatch();
  const layers = useSelector(layersSelector);
  const sortedLayers = layers.sort((a, b) => a.name.localeCompare(b.name));
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const showLayerSelector = useSelector(showLayerSelectorSelector);
  const selectedMainLayer = layers.find(
    layer => layer.id === selectedLayerIds.mainId
  );
  const selectedCompareLayer = layers.find(
    layer => layer.id === selectedLayerIds.compareId
  );

  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, selectedLayerIds.mainId)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, selectedLayerIds.compareId)
  );
  const mainFlyTo = mainLayerDetails?.flyTo;
  const compareFlyTo = compareLayerDetails?.flyTo;

  // set fly to for main layer
  useEffect(() => {
    if (mainFlyTo) {
      dispatch(setFlyToAction(mainFlyTo));
    }
  }, [dispatch, mainFlyTo]);

  // set fly to for compare layer
  useEffect(() => {
    if (compareFlyTo) {
      dispatch(setFlyToAction(compareFlyTo));
    }
  }, [dispatch, compareFlyTo]);

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
                onClick={() => dispatch(showLayerSelectorAction(false))}
              />
            </div>
            {selectedMainLayer && (
              <SelectedLayerListItem
                onRemove={() => dispatch(setSelectedLayerIdsAction(null, true))}
                layer={selectedMainLayer}
              />
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
              layers={sortedLayers}
              selectedLayerIds={selectedLayerIds}
              onSelect={(layerId, isMain) => {
                dispatch(setSelectedLayerIdsAction(layerId, isMain));
              }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LayerSelector;
