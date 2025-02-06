import React, {FunctionComponent, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import {createEmbedUrl} from '../../../libs/create-embed-url';
import {ElementOptions} from '../../../types/embed-elements';
import {getEmbedParamsString} from '../../../libs/get-embed-params-string';
import EmbedLinkPreview from '../embed-link-preview/embed-link-preview';
import CopyToClipboardButton from '../copy-to-clipboard-button/copy-to-clipboard-button';

import styles from './embed-result.module.css';

interface Props {
  elementsChecked: ElementOptions;
}
const EmbedResult: FunctionComponent<Props> = ({elementsChecked}) => {
  const urlParams = getEmbedParamsString(elementsChecked);
  const iFrameRef = useRef<HTMLTextAreaElement>(null);

  const createiFrameCode = () => {
    const embedUrl = createEmbedUrl(urlParams);

    return `<iframe width="100%" height="100%" src="${embedUrl}" title="Climate from Space"></iframe>`;
  };

  const copyUrl = (value?: string) => {
    const copyValue = value ?? createEmbedUrl(urlParams);

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

        <CopyToClipboardButton
          label="copyEmbedCode"
          onCopy={() => iFrameRef.current && copyUrl(iFrameRef.current.value)}
        />
      </div>

      <div className={styles.resultItem}>
        <h2 className={styles.resultTitle}>
          <FormattedMessage id={'embedLink'} />
        </h2>
        <EmbedLinkPreview embedUrl={createEmbedUrl(urlParams)} />

        <CopyToClipboardButton label="copyEmbedLink" onCopy={() => copyUrl()} />
      </div>
    </div>
  );
};

export default EmbedResult;
