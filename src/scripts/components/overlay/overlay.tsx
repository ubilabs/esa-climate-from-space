import React, {FunctionComponent} from 'react';

import styles from './overlay.styl';
import {RemoveIcon} from '../icons/remove-icon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const Overlay: FunctionComponent<Props> = ({onClose}) => {
  return (
    <div className={styles.overlay}>
      <h1>test</h1>
      <div onClick={() => onClose()}>
        <RemoveIcon />
      </div>
    </div>
  );
};

export default Overlay;
