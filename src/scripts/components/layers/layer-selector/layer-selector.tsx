import { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";

import { useMatomo } from "@datapunt/matomo-tracker-react";
import Button from "../../main/button/button";
import { CloseIcon } from "../../main/icons/close-icon";
import LayerList from "../layer-list/layer-list";
import SelectedLayerListItem from "../selected-layer-list-item/selected-layer-list-item";

import { useThunkDispatch } from "../../../hooks/use-thunk-dispatch";
import { languageSelector } from "../../../selectors/language";
import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";
import { showLayerSelector as showLayerSelectorSelector } from "../../../selectors/show-layer-selector";
import { setSelectedLayerIds } from "../../../reducers/layers";
import { setShowLayer } from "../../../reducers/show-layer-selector";
import { layersApi, useGetLayerListQuery } from "../../../services/api";

import styles from "./layer-selector.module.css";

const LayerSelector: FunctionComponent = () => {
  const dispatch = useDispatch();
  const thunkDispatch = useThunkDispatch();

  const { trackEvent } = useMatomo();

  const selectedLayerIds = useSelector(selectedLayerIdsSelector);

  const showLayerSelector = useSelector(showLayerSelectorSelector);
  const lang = useSelector(languageSelector);

  const { data: layers } = useGetLayerListQuery(lang);
  if (!layers) {
    return null;
  }

  const selectedMainLayer = layers.find(
    (layer) => layer.id === selectedLayerIds.mainId,
  );
  const selectedCompareLayer = layers.find(
    (layer) => layer.id === selectedLayerIds.compareId,
  );

  const sortedLayers = layers
    .map((layer) => ({ ...layer }))
    .sort((a, b) => a.shortName.localeCompare(b.shortName));

  return (
    <AnimatePresence>
      {showLayerSelector ? (
        <motion.div
          className={styles.layerSelector}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 100, stiffness: 1400 }}
          exit={{ x: "100%" }}
        >
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                <FormattedMessage id={"layers"} />
              </h1>
              <Button
                className={styles.button}
                icon={CloseIcon}
                onClick={() => dispatch(setShowLayer(false))}
              />
            </div>
            {selectedMainLayer && (
              <SelectedLayerListItem
                isCompareSelected={Boolean(selectedCompareLayer)}
                onRemove={() =>
                  dispatch(
                    setSelectedLayerIds({
                      layerId: null,
                      isPrimary: true,
                    }),
                  )
                }
                layer={selectedMainLayer}
              />
            )}
            {selectedCompareLayer && (
              <SelectedLayerListItem
                layer={selectedCompareLayer}
                onRemove={() =>
                  dispatch(
                    setSelectedLayerIds({
                      layerId: null,
                      isPrimary: false,
                    }),
                  )
                }
              />
            )}
            <LayerList
              layers={sortedLayers}
              selectedLayerIds={selectedLayerIds}
              onSelect={(layerId, isMain) => {
                dispatch(setShowLayer(false));
                thunkDispatch(layersApi.endpoints.getLayer.initiate(layerId));
                dispatch(setSelectedLayerIds({ layerId, isPrimary: isMain }));
                const name = layers.find((layer) => layer.id === layerId)?.name;
                trackEvent({
                  category: "datasets",
                  action: isMain ? "select" : "compare",
                  name: isMain ? name : `${selectedMainLayer?.name} - ${name}`,
                });
              }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LayerSelector;
