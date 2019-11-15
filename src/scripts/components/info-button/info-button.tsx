import React, {FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';

import {InfoIcon} from '../icons/info-icon';

import {LayerListItem} from '../../types/layer-list';

import styles from './info-button.styl';

interface Props {
  layer: LayerListItem | null;
}

const InfoButton: FunctionComponent<Props> = ({layer}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const onButtonClickHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    layer && (
      <div className={styles.infoButton}>
        <button
          className={styles.icon}
          title={intl.formatMessage({id: 'data-info'})}
          onClick={() => onButtonClickHandler()}>
          <InfoIcon />
        </button>
        {isOpen && (
          <div className={styles.modal}>
            <span className={styles.description}>{layer.description}</span>
            <a className={styles.link} href={layer.link}>
              {layer.name}
            </a>
          </div>
        )}
      </div>
    )
  );
};

export default InfoButton;
