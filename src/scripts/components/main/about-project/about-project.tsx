import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';
import ReactMarkdown from 'react-markdown';

import config from '../../../config/main';

import styles from './about-project.module.styl';

const AboutProject: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.aboutProject}>
      <div className={styles.content}>
        <ReactMarkdown
          children={intl.formatMessage({id: 'projectDescription'})}
          linkTarget="_blank"
          allowedElements={config.markdownAllowedElements}
        />
      </div>
    </div>
  );
};

export default AboutProject;
