import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';
import {ChangeLanguageIcon} from '../icons/change-language-icon';

import styles from './language-bubble.styl';

interface Props {
  onClose: () => void;
  onMenuOpen: () => void;
}

const LanguageBubble: FunctionComponent<Props> = ({onClose, onMenuOpen}) => (
  <div className={styles.languageBubble}>
    <div className={styles.detectedLanguage}>
      <ChangeLanguageIcon />
      <p className={styles.language}>
        <FormattedMessage id={'detectedLanguage'} />
      </p>
    </div>
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

export default LanguageBubble;
