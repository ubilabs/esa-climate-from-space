import React, {Fragment, FunctionComponent, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';

import {embedElementsSelector} from '../../../selectors/embed-elements-selector';
import {ElementOptions} from '../../../types/embed-elements';
import EmbedResult from '../embed-result/embed-result';
import EmbedSettings from '../embed-settings/embed-settings';
import {createEmbedUrl} from '../../../libs/create-embed-url';
import {getEmbedParamsString} from '../../../libs/get-embed-params-string';
import EmbedLinkPreview from '../embed-link-preview/embed-link-preview';

import styles from './embed-wizard.module.css';

const EmbedWizard: FunctionComponent = () => {
  const embedElements = useSelector(embedElementsSelector);
  const [uiElementsChecked, setUiElementsChecked] = useState(
    embedElements as ElementOptions
  );
  const urlParams = getEmbedParamsString(uiElementsChecked);

  return (
    <div className={styles.embedWizard}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h1>
            <FormattedMessage id={'embedWizard'} />
          </h1>
          <p>
            <FormattedMessage id={'embedDescription'} />
          </p>
        </div>

        <EmbedResult elementsChecked={uiElementsChecked} />
        <EmbedSettings
          elementsChecked={uiElementsChecked}
          handleChange={elements => setUiElementsChecked(elements)}
        />
        <div className={styles.divider}></div>
        <Fragment>
          <h2 className={styles.previewTitle}>
            <FormattedMessage id={'previewTitle'} />
          </h2>
          <div className={styles.resultLink}>
            <EmbedLinkPreview
              className={styles.previewTextArea}
              embedUrl={createEmbedUrl(urlParams)}
            />

            <a
              className={styles.previewButton}
              href={createEmbedUrl(urlParams)}
              target={'_blank'}
              rel="noopener noreferrer">
              <button>
                <FormattedMessage id={'preview'} />
              </button>
            </a>
          </div>
        </Fragment>
      </div>
    </div>
  );
};

export default EmbedWizard;
