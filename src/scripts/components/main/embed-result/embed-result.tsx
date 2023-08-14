import React, {FunctionComponent, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import {createEmbedUrl} from '../../../libs/create-embed-url';
import {ElementOptions} from '../../../types/embed-elements';
import {getEmbedParamsString} from '../../../libs/get-embed-params-string';
import CopyToClipboardButton from '../copy-to-clipboard-button/copy-to-clipboard-button';

import styles from './embed-result.module.styl';

interface Props {
  elementsChecked: ElementOptions;
}
const EmbedResult: FunctionComponent<Props> = ({elementsChecked}) => {
  const urlParams = getEmbedParamsString(elementsChecked);
  const iFrameRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLTextAreaElement>(null);

  const createiFrameCode = () => {
    const embedUrl = createEmbedUrl(urlParams);

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

        <CopyToClipboardButton
          label="copyEmbedCode"
          handleCopy={() =>
            iFrameRef.current && copyUrl(iFrameRef.current.value)
          }
        />
      </div>

      <div className={styles.resultItem}>
        <h2 className={styles.resultTitle}>
          <FormattedMessage id={'embedLink'} />
        </h2>
        <textarea
          ref={linkRef}
          className={styles.embedLinkTextArea}
          value={createEmbedUrl(urlParams)}
          wrap="off"
          readOnly
        />

        <CopyToClipboardButton
          label="copyEmbedLink"
          handleCopy={() => linkRef.current && copyUrl(linkRef.current.value)}
        />
      </div>
    </div>
  );
};

export default EmbedResult;
