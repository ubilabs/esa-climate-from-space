import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';

import styles from './embed-result.module.styl';

interface Props {
  paramsString: string;
}
const EmbedResult: FunctionComponent<Props> = ({paramsString}) => (
  <div className={styles.result}>
    <div className={styles.resultItem}>
      <h2>
        <FormattedMessage id={'embedCode'} />
      </h2>
      <textarea
        className={styles.embedTextArea}
        value={paramsString}
        readOnly
      />
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
        value={paramsString}
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

export default EmbedResult;
