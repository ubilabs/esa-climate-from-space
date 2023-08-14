import React, {FunctionComponent, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';

import {embedElementsSelector} from '../../../selectors/embed-elements-selector';
import {ElementOptions} from '../../../types/embed-elements';
import EmbedCheckboxList from '../embed-checkbox-list/embed-checkbox-list';
import EmbedResult from '../embed-result/embed-result';

import styles from './embed-wizard.module.styl';

const EmbedWizard: FunctionComponent = () => {
  const embedElements = useSelector(embedElementsSelector);
  const [appElementsChecked, setAppElementsChecked] = useState(
    embedElements as ElementOptions
  );

  return (
    <div className={styles.embedWizard}>
      <div className={styles.header}>
        <h1>
          <FormattedMessage id={'embedWizard'} />
        </h1>
        <p>
          <FormattedMessage id={'embedDescription'} />
        </p>
      </div>

      <EmbedResult elementsChecked={appElementsChecked} />

      <div className={styles.settings}>
        <h2>
          <FormattedMessage id={'app'} />
        </h2>
        <EmbedCheckboxList
          elementsChecked={appElementsChecked}
          handleChange={elements => setAppElementsChecked(elements)}
        />
      </div>

      <div className={styles.preview}></div>
    </div>
  );
};

export default EmbedWizard;
