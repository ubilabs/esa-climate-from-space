import React, {FunctionComponent} from 'react';
import {createPortal} from 'react-dom';
import cx from 'classnames';

import Button from '../button/button';
import {CloseIcon} from '../icons/close-icon';

import styles from './overlay.styl';

interface Props {
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const Overlay: FunctionComponent<Props> = ({
  children,
  className = '',
  onClose,
  showCloseButton = true
}) => {
  const modalElement = document.getElementById('modal');
  const classes = cx(styles.overlay, className);

  const Content = (
    <div className={classes}>
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
