import React, {FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';

import {InfoIcon} from '../icons/info-icon';

import styles from './info-button.styl';
import {LayerListItem} from '../../types/layer-list';

interface Props {
  main: LayerListItem | null;
  compare: LayerListItem | null;
}

const InfoButton: FunctionComponent<Props> = ({main, compare}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const onButtonClickHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.infoButton}>
      <button
        className={styles.icon}
        title={intl.formatMessage({id: 'data-info'})}
        onClick={() => onButtonClickHandler()}>
        <InfoIcon />
      </button>
      {isOpen && (
        <div className={styles.modal}>
          <span className={styles.description}>
            {main ? main.description : compare && compare.description}
          </span>
          <span className={styles.link}>
            {main ? main.link : compare && compare.link}
          </span>
        </div>
      )}
    </div>
  );
};

export default InfoButton;
