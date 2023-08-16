import React, {FunctionComponent, useRef} from 'react';
import {FormattedMessage} from 'react-intl';

import Button from '../button/button';
import {CopyTextIcon} from '../icons/copy-text-icon';
import {createEmbedUrl} from '../../../libs/create-embed-url';
import {ElementOptions} from '../../../types/embed-elements';
import {getEmbedParamsString} from '../../../libs/get-embed-params-string';

import styles from './embed-result.module.styl';
import EmbedTextarea from '../embed-textarea/embed-textarea';

interface Props {
  elementsChecked: ElementOptions;
}
const EmbedResult: FunctionComponent<Props> = ({elementsChecked}) => {
  const urlParams = getEmbedParamsString(elementsChecked);
  const iFrameRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

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
        <EmbedTextarea ref={linkRef} embedUrl={createEmbedUrl(urlParams)} />

        <Button
          className={styles.copyButton}
          icon={CopyTextIcon}
          label="copyEmbedLink"
          onClick={() => copyUrl()}
        />
      </div>
    </div>
  );
};

export default EmbedResult;
