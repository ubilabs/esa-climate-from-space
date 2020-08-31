import React, {FunctionComponent} from 'react';
import {FormattedNumber} from 'react-intl';
import cx from 'classnames';

import {replaceUrlPlaceholders} from '../../../libs/replace-url-placeholders';
import config from '../../../config/main';

import styles from './layer-legend.styl';

interface Props {
  id: string;
  values: (number | string)[];
  unit: string;
  isCompare?: boolean;
}

const LayerLegend: FunctionComponent<Props> = ({
  id,
  values,
  unit,
  isCompare = false
}) => (
  <div className={cx(styles.layerLegend, isCompare && styles.rightSided)}>
    <img
      className={styles.image}
      src={replaceUrlPlaceholders(config.legendImage, {
        variable: id.split('.')[1]
      })}
    />
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

export default LayerLegend;
