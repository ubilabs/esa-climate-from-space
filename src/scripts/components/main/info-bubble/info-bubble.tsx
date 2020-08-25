import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';

import styles from './info-bubble.styl';

interface Props {
  onClose: () => void;
  onMenuOpen: () => void;
}

const InfoBubble: FunctionComponent<Props> = ({onClose, onMenuOpen}) => (
  <div className={styles.infoBubble}>
    <p className={styles.language}>
      <FormattedMessage id={'detectedLanguage'} />
    </p>
    <div className={styles.buttons}>
      <Button
        className={styles.changeLanguage}
        label="changeLanguage"
        onClick={() => onMenuOpen()}
      />
      <Button
        className={styles.keepLanguage}
        label="keepLanguage"
        onClick={() => onClose()}
      />
    </div>
  </div>
);

export default InfoBubble;
