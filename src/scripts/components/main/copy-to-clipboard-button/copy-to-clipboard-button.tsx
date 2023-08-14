import React, {FunctionComponent, useEffect, useState} from 'react';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';
import {CheckIcon} from '../icons/check-icon';

import styles from './copy-to-clipboard-button.module.styl';

interface Props {
  label: string;
  handleCopy: () => void;
}
const CopyToClipboardButton: FunctionComponent<Props> = ({
  label,
  handleCopy
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) {
        setCopied(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <Button
      className={styles.copyButton}
      icon={copied ? CheckIcon : CopyTextIcon}
      label={label}
      onClick={() => {
        setCopied(true);
        handleCopy();
      }}
    />
  );
};

export default CopyToClipboardButton;
