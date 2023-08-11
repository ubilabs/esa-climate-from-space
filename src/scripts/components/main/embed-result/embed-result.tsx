import React, {FunctionComponent, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';
import {createEmbedUrl} from '../../../libs/create-embed-url';

import styles from './embed-result.module.styl';

interface Props {
  paramsString: string;
}
const EmbedResult: FunctionComponent<Props> = ({paramsString}) => {
  const iFrameRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLTextAreaElement>(null);

  const createiFrameCode = () => {
    const embedUrl = createEmbedUrl(paramsString);

    return `<iframe width="100%" height="100%" src="${embedUrl}" title="Climate from Space"></iframe>`;
  };

  const copyUrl = (copyValue: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(copyValue);
    } else {
      document.execCommand('copy');
    }
  };

  return (
    <div className={styles.result}>
      <div className={styles.resultItem}>
        <h2 className={styles.resultTitle}>
          <FormattedMessage id={'embedCode'} />
        </h2>
        <textarea
          ref={iFrameRef}
          className={styles.embedTextArea}
          value={createiFrameCode()}
          readOnly
        />
        <Button
          className={styles.copyButton}
          icon={CopyTextIcon}
          label="copyEmbedCode"
          onClick={() => iFrameRef.current && copyUrl(iFrameRef.current.value)}
        />
      </div>

      <div className={styles.resultItem}>
        <h2 className={styles.resultTitle}>
          <FormattedMessage id={'embedLink'} />
        </h2>
        <textarea
          ref={linkRef}
          className={styles.embedLinkTextArea}
          value={createEmbedUrl(paramsString)}
          wrap="off"
          readOnly
        />
        <Button
          className={styles.copyButton}
          icon={CopyTextIcon}
          label="copyEmbedLink"
          onClick={() => linkRef.current && copyUrl(linkRef.current.value)}
        />
      </div>
    </div>
  );
};

export default EmbedResult;
