import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';
import {ElementOptions} from '../../../types/embed-elements';

import styles from './embed-result.module.styl';

interface Props {
  elementsChecked: ElementOptions;
}
const EmbedResult: FunctionComponent<Props> = ({elementsChecked}) => {
  const disabledParams = Object.fromEntries(
    Object.entries(elementsChecked)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value === false)
      .map(([key, value]) => [key, value.toString()])
  );
  const urlParams = new URLSearchParams(disabledParams).toString();

  return (
    <div className={styles.result}>
      <div className={styles.resultItem}>
        <h2>
          <FormattedMessage id={'embedCode'} />
        </h2>
        <textarea className={styles.embedTextArea} value={urlParams} readOnly />
        <Button
          className={styles.copyButton}
          icon={CopyTextIcon}
          label="copyEmbedCode"
        />
      </div>

      <div className={styles.resultItem}>
        <h2>
          <FormattedMessage id={'embedLink'} />
        </h2>
        <textarea
          className={styles.embedLinkTextArea}
          value={urlParams}
          wrap="off"
          readOnly
        />
        <Button
          className={styles.copyButton}
          icon={CopyTextIcon}
          label="copyEmbedLink"
        />
      </div>
    </div>
  );
};

export default EmbedResult;
