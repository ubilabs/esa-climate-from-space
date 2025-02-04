import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';
import ReactMarkdown from 'react-markdown';

import config from '../../../config/main';

import styles from './attributions.module.css';

const Attributions: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.attributions}>
      <div className={styles.credits}>
        <ReactMarkdown
          children={intl.formatMessage({id: 'attributionDescription'})}
          linkTarget="_blank"
          allowedElements={config.markdownAllowedElements}
        />
      </div>
    </div>
  );
};

export default Attributions;
