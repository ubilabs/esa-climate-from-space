import React, {FunctionComponent, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useSelector} from 'react-redux';

import {appElementsSelector} from '../../../selectors/embed/app-elements-embed';
import {ElementOptions} from '../../../types/embed-elements';
import EmbedCheckboxList from '../embed-checkbox-list/embed-checkbox-list';
import EmbedResult from '../embed-result/embed-result';

import styles from './embed-wizard.module.styl';

const EmbedWizard: FunctionComponent = () => {
  const {appElements} = useSelector(appElementsSelector);
  const [appElementsChecked, setAppElementsChecked] = useState(
    appElements as ElementOptions
  );

  const disabledParamsString = Object.entries(appElementsChecked)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value === false)
    .map(key => `${key[0]}=${key[1]}`)
    .join('&');

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

      <EmbedResult paramsString={disabledParamsString} />

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
