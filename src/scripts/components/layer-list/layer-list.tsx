import React, {FunctionComponent, MouseEvent} from 'react';
import {useHistory, useParams} from 'react-router';
import cx from 'classnames';

import {LayerList as LayerListType} from '../../types/layer-list';

import styles from './layer-list.styl';

interface Props {
  layers: LayerListType;
  isMain: boolean;
}

const LayerList: FunctionComponent<Props> = ({layers, isMain}) => {
  const history = useHistory();
  const {mainLayerId = '', compareLayerId = ''} = useParams();
  const selectedLayerId = isMain ? mainLayerId : compareLayerId;

  const layerClickHandler = (event: MouseEvent, id: string) => {
    event.stopPropagation();

    if (id === selectedLayerId) {
      if (!isMain || !compareLayerId) {
        const newPath = isMain ? '/' : `/layers/${mainLayerId}`;
        history.push(newPath);
      }
      return;
    }

    const newPath = isMain
      ? `/layers/${id}/${compareLayerId}`
      : `/layers/${mainLayerId}/${id}`;

    history.push(newPath);
  };

  return (
    <ul className={styles.layerList}>
      {layers.map(layer => {
        const isSelected = selectedLayerId === layer.id;
        const layerItemClasses = cx(
          styles.layerItem,
          isSelected && styles.layerItemSelected
        );

        if (layer.subLayers.length === 0) {
          return (
            <li
              className={layerItemClasses}
              key={layer.id}
              onClick={event => layerClickHandler(event, layer.id)}>
              {layer.name}
            </li>
          );
        }

        return (
          <li className={layerItemClasses} key={layer.id}>
            {layer.name}

            {layer.subLayers && (
              <ul className={styles.subLayersList}>
                {layer.subLayers.map(subLayer => {
                  const isSubSelected = selectedLayerId === subLayer.id;
                  const subLayerItemClasses = cx(
                    styles.subLayerItem,
                    isSubSelected && styles.subLayerItemSelected
                  );

                  return (
                    <li
                      className={subLayerItemClasses}
                      onClick={event => layerClickHandler(event, subLayer.id)}
                      key={subLayer.id}>
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
};

export default LayerList;
