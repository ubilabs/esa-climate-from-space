import { FunctionComponent } from "react";

import LayerListItem from "../layer-list-item/layer-list-item";

import { SelectedLayerIdsState } from "../../../reducers/layers/selected-ids";

import { LayerListItem as LayerListItemType } from "../../../types/layer-list";

import styles from "./layer-list.module.css";

interface Props {
  selectedLayerIds: SelectedLayerIdsState;
  layers: LayerListItemType[];
  onSelect: (id: string, isMain: boolean) => void;
}

const LayerList: FunctionComponent<Props> = ({
  selectedLayerIds,
  layers,
  onSelect,
}) => {
  const { mainId } = selectedLayerIds;
  const isMainSelected = Boolean(mainId);

  return (
    <ul className={styles.layerList}>
      {layers
        .filter((layer) => !Object.values(selectedLayerIds).includes(layer.id))
        .map((layer) => (
          <li key={layer.id}>
            <LayerListItem
              onSelect={(id, isMain) => onSelect(id, isMain)}
              isMainSelected={isMainSelected}
              layer={layer}
            />
          </li>
        ))}
    </ul>
  );
};

export default LayerList;
