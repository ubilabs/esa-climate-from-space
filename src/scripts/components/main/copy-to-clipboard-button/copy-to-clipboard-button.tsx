import React, {FunctionComponent, useEffect, useState} from 'react';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';
import {CheckIcon} from '../icons/check-icon';

import styles from './copy-to-clipboard-button.module.styl';

interface Props {
  label: string;
  onCopy: () => void;
}
const CopyToClipboardButton: FunctionComponent<Props> = ({label, onCopy}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer = -1;

    if (copied) {
      timer = window.setTimeout(() => {
        setCopied(false);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      className={styles.copyButton}
      icon={copied ? CheckIcon : CopyTextIcon}
      label={label}
      onClick={() => {
        setCopied(true);
        onCopy();
      }}
    />
  );
};

export default CopyToClipboardButton;
