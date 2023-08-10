import React, {FunctionComponent, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';

import styles from './embed-result.module.styl';

interface Props {
  paramsString: string;
}
const EmbedResult: FunctionComponent<Props> = ({paramsString}) => {
  const iFrameRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLTextAreaElement>(null);
  const currentUrl = window.location.href;

  const createEmbedUrl = () => {
    if (paramsString.length) {
      return currentUrl.includes('?')
        ? `${currentUrl}&${paramsString}`
        : `${currentUrl}?${paramsString}`;
    }
    return '';
  };

  const createiFrameCode = () => {
    if (paramsString.length) {
      const embedUrl = currentUrl.includes('?')
        ? `${currentUrl}&${paramsString}`
        : `${currentUrl}?${paramsString}`;

      return `<iframe width="560" height="315" src="${embedUrl}" title="Climate from Space"></iframe>`;
    }
    return '';
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
          value={createEmbedUrl()}
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
