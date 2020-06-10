import React, {FunctionComponent} from 'react';
import {createPortal} from 'react-dom';

import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';

import styles from './overlay.styl';

interface Props {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Overlay: FunctionComponent<Props> = ({
  children,
  onClose,
  showCloseButton = true
}) => {
  const modalElement = document.getElementById('modal');

  const Content = (
    <div className={styles.overlay}>
      {showCloseButton && (
        <Button
          icon={CloseIcon}
          className={styles.closeButton}
          onClick={() => onClose && onClose()}
        />
      )}
      <div className={styles.overlayContent}>{children}</div>
    </div>
  );

  if (modalElement) {
    return createPortal(Content, modalElement);
  }

  return null;
};

export default Overlay;
