import React, {FunctionComponent, MouseEvent} from 'react';
import cx from 'classnames';
import {Layer} from '../../actions/fetch-layers';
import styles from './layer-list.styl';

interface Props {
  layers: Layer[];
  selected: string | null;
  onSelect: (id: string) => void;
}

const LayerList: FunctionComponent<Props> = ({layers, selected, onSelect}) => (
  <ul className={styles.layerList}>
    {layers.map(layer => {
      const layerClickHandler = () => {
        if (layer.subLayers.length === 0) {
          onSelect(layer.id);
        }
      };
      const layerItemClass = cx(styles.layerItem, {
        [styles.layerItemSelected]: selected === layer.id
      });
      return (
        <li
          className={layerItemClass}
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
                const subLayerItemClass = cx(styles.subLayerItem, {
                  [styles.subLayerItemSelected]: selected === subLayer.id
                });
                return (
                  <li
                    className={subLayerItemClass}
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
