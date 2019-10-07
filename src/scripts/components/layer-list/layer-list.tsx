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
      const isSelected = selected === layer.id;
      const layerItemClasses = cx(
        styles.layerItem,
        isSelected && styles.layerItemSelected
      );

      return (
        <li
          className={layerItemClasses}
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
                const isSubSelected = selected === subLayer.id;
                const subLayerItemClasses = cx(
                  styles.subLayerItem,
                  isSubSelected && styles.subLayerItemSelected
                );

                return (
                  <li
                    className={subLayerItemClasses}
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
