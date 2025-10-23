import { FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import { replaceUrlPlaceholders } from "../../../libs/replace-url-placeholders";
import config from "../../../config/main";
import { DownloadButton } from "../../main/download-button/download-button";

import { LayerListItem as LayerListItemType } from "../../../types/layer-list";

import styles from "./layer-list-item.module.css";

interface Props {
  layer: LayerListItemType;
  isMainSelected: boolean;
  onSelect: (id: string, isMain: boolean) => void;
}

const LayerListItem: FunctionComponent<Props> = ({
  layer,
  isMainSelected,
  onSelect,
}) => {
  const offlineUrl = replaceUrlPlaceholders(config.api.layerOfflinePackage, {
    id: layer.id,
  });

  return (
    <div
      className={styles.layerItem}
      onClick={() => onSelect(layer.id, false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect(layer.id, false);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span className={styles.layerTitle}>{layer.shortName}</span>
      {isMainSelected && (
        <button className={styles.compare}>
          <FormattedMessage id={"layerSelector.compare"} />
        </button>
      )}

      <DownloadButton url={offlineUrl} id={layer.id} />
    </div>
  );
};

export default LayerListItem;
