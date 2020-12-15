import React, {FunctionComponent, useState} from 'react';
import {FormattedNumber} from 'react-intl';
import cx from 'classnames';

import {replaceUrlPlaceholders} from '../../../libs/replace-url-placeholders';
import config from '../../../config/main';
import {isElectron} from '../../../libs/electron/is-electron';
import {isOffline} from '../../../libs/electron/is-offline';
import {getOfflineLegendImageUrl} from '../../../libs/electron/get-offline-legend-image-url';

import {BasemapId} from '../../../types/basemap';

import styles from './layer-legend.styl';

const backgroundColorMapping: {[_: string]: string} = {
  blue: '#2A417B',
  land: '#8E8E8E',
  ocean: '#D4D4D4',
  atmosphere: '#8E8E8E',
  dark: '#262626'
};

const getBackgroundColor = (basemap: BasemapId | null) => {
  if (!basemap) {
    return backgroundColorMapping[config.defaultBasemap];
  }

  return backgroundColorMapping[basemap];
};

interface Props {
  id: string;
  values: (number | string)[];
  unit: string;
  basemap: BasemapId | null;
  hoverLegendValues?: LegendValueColor[];
  isCompare?: boolean;
}

const LayerLegend: FunctionComponent<Props> = ({
  id,
  values,
  unit,
  basemap,
  hoverLegendValues,
  isCompare = false
}) => {
  const imageUrlTemplate =
    isElectron() && isOffline()
      ? getOfflineLegendImageUrl()
      : config.legendImage;
  const imageUrl = replaceUrlPlaceholders(imageUrlTemplate, {id});

  const [legendValue, setLegendValue] = useState('');

  return (
    <div className={cx(styles.layerLegend, isCompare && styles.rightSided)}>
      {hoverLegendValues ? (
        <div className={styles.hoverLegend}>
          {hoverLegendValues.map((legendItem, index) => (
            <div className={styles.legendItem} key={index}>
              <div
                className={styles.color}
                style={{backgroundColor: legendItem.color}}
                onMouseOver={() => setLegendValue(legendItem.value)}
                onMouseLeave={() => setLegendValue('')}></div>
              {legendValue === legendItem.value && (
                <span className={styles.hoverValue}>{legendValue}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <img
          className={styles.image}
          style={{backgroundColor: getBackgroundColor(basemap)}}
          src={imageUrl}
        />
      )}
      <div className={styles.values}>
        {values.map((value, index) => (
          <div className={styles.value} key={value}>
            {typeof value === 'string' ? (
              value
            ) : (
              <span>
                <FormattedNumber value={value} /> {index === 0 ? unit : ''}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerLegend;
