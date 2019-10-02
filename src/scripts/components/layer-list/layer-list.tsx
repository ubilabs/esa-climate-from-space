import React, {FunctionComponent, MouseEvent} from 'react';
import {Layer} from '../../actions/fetch-layers';
import styles from './layer-list.styl';

interface Props {
  layers: Layer[];
  selected: string;
  onSelect: (id: string) => void;
}

const LayerList: FunctionComponent<Props> = ({layers, onSelect}) => (
  <ul className={styles.layerList}>
    {layers.map(layer => {
      const layerClickHandler = () => {
        if (layer.subLayers.length === 0) {
          onSelect(layer.id);
        }
      };

      return (
        <li
          className={styles.layerItem}
          key={layer.id}
          onClick={() => layerClickHandler()}>
          {layer.name}

          {layer.subLayers && (
            <ul className={styles.subLayersList}>
              {layer.subLayers.map(subLayer => {
                const subLayerClickHandler = (event: MouseEvent) => {
                  event.stopPropagation();
                  onSelect(subLayer.id);
                };
                return (
                  <li
                    className={styles.subLayerItem}
                    key={subLayer.id}
                    onClick={event => subLayerClickHandler(event)}>
                    {subLayer.name}
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    })}
  </ul>
);

export default LayerList;
