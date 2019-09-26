import React, {FunctionComponent} from 'react';
import {Layer} from '../../actions/fetch-layers';
import styles from './layer-list.styl';

interface Props {
  layers: Layer[];
  selected: string;
  onSelect: (id: string) => void;
}

const LayerList: FunctionComponent<Props> = ({layers, selected, onSelect}) => {
  return (
    <ul className={styles.layerList}>
      {layers.map(layer => (
        <li
          className={styles.layerItem}
          key={layer.id}
          onClick={() => {
            if (layer.subLayer && layer.subLayer.length) {
              return;
            }
            onSelect(layer.id);
          }}>
          {layer.name}
          {layer.subLayer ? (
            <ul className={styles.subLayerList}>
              {layer.subLayer.map(subLayer => (
                <li
                  className={styles.subLayerItem}
                  key={subLayer.id}
                  onClick={() => onSelect(subLayer.id)}>
                  {subLayer.name}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default LayerList;
