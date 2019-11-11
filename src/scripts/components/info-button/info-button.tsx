import React, {FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';

import {InfoIcon} from '../icons/info-icon';

import styles from './info-button.styl';

const InfoButton: FunctionComponent = () => {
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
          <span>Layer Name</span>
        </div>
      )}
    </div>
  );
};

export default InfoButton;
