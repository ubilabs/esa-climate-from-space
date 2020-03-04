import React, {FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';

import Overlay from '../overlay/overlay';
import {InfoIcon} from '../icons/info-icon';
import LayerInfo from '../layer-info/layer-info';

import {LayerListItem} from '../../types/layer-list';

import styles from './info-button.styl';

interface Props {
  layer: LayerListItem | null;
}

const InfoButton: FunctionComponent<Props> = ({layer}) => {
  const intl = useIntl();
  const [showMenu, setShowMenu] = useState(false);

  return (
    layer && (
      <div className={styles.infoButton}>
        <button
          className={styles.icon}
          title={intl.formatMessage({id: 'dataInfo'})}
          onClick={() => setShowMenu(true)}>
          <InfoIcon />
        </button>

        {showMenu && (
          <Overlay onClose={() => setShowMenu(false)}>
            <LayerInfo layer={layer} />
          </Overlay>
        )}
      </div>
    )
  );
};

export default InfoButton;
