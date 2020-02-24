import React, {FunctionComponent} from 'react';
import {createPortal} from 'react-dom';

import Button from '../button/button';
import {RemoveIcon} from '../icons/remove-icon';

import styles from './overlay.styl';

interface Props {
  onClose: () => void;
}

const Overlay: FunctionComponent<Props> = ({children, onClose}) => {
  const modalElement = document.getElementById('modal');

  const Content = (
    <div className={styles.overlay} onClick={() => onClose()}>
      <Button
        icon={RemoveIcon}
        className={styles.closeButton}
        onClick={() => onClose()}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );

  if (modalElement) {
    return createPortal(Content, modalElement);
  }
  return null;
};

export default Overlay;
