import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

import { selectedLayerIdsSelector } from "../../../selectors/layers/selected-ids";

import { RemoveIcon } from "../../main/icons/remove-icon";
import { replaceUrlPlaceholders } from "../../../libs/replace-url-placeholders";
import config from "../../../config/main";
import { isElectron } from "../../../libs/electron/is-electron";
import { isOffline } from "../../../libs/electron/is-offline";
import { getOfflineLayerIconUrl } from "../../../libs/electron/get-offline-layer-icon-url";

import { LayerListItem } from "../../../types/layer-list";

import styles from "./selected-layer-list-item.module.css";

interface Props {
  layer: LayerListItem;
  isCompareSelected?: boolean;
  onRemove: () => void;
}

const SelectedLayerListItem: FunctionComponent<Props> = ({
  layer,
  isCompareSelected,
  onRemove,
}) => {
  const layerIconTemplate =
    isElectron() && isOffline()
      ? getOfflineLayerIconUrl()
      : config.api.layerIcon;
  const layerIconUrl = replaceUrlPlaceholders(layerIconTemplate, {
    id: layer.id,
  });
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const { mainId } = selectedLayerIds;

  return (
    <div className={styles.selectedLayerListItem}>
      <div className={styles.layer}>
        <img src={layerIconUrl} className={styles.layerIcon} alt={layer.shortName} />
        <span className={styles.layerTitle}>{layer.shortName}</span>
      </div>
      {!isCompareSelected && layer.id !== mainId && (
        <button className={styles.removeIcon} onClick={() => onRemove()}>
          <RemoveIcon />
        </button>
      )}
    </div>
  );
};

export default SelectedLayerListItem;
