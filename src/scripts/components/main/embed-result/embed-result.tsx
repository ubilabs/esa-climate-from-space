import React, {FunctionComponent, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';
import {ElementOptions} from '../../../types/embed-elements';
import {embedParamsString} from '../../../libs/get-embed-params-string';

import styles from './embed-result.module.styl';

interface Props {
  elementsChecked: ElementOptions;
}
const EmbedResult: FunctionComponent<Props> = ({elementsChecked}) => {
  const urlParams = embedParamsString(elementsChecked);
  const iFrameRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLTextAreaElement>(null);
  const currentUrl = window.location.href;

  const createEmbedUrl = () => {
    if (urlParams.length) {
      return currentUrl.includes('?')
        ? `${currentUrl}&${urlParams}`
        : `${currentUrl}?${urlParams}`;
    }
    return '';
  };

  const createiFrameCode = () => {
    if (urlParams.length) {
      const embedUrl = currentUrl.includes('?')
        ? `${currentUrl}&${urlParams}`
        : `${currentUrl}?${urlParams}`;

      return `<iframe width="100%" height="100%" src="${embedUrl}" title="Climate from Space"></iframe>`;
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
