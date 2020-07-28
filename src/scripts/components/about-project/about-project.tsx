import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import styles from './about-project.styl';

const AboutProject: FunctionComponent = () => (
  <div className={styles.aboutProject}>
    <div className={styles.title}>
      <h1>
        <FormattedMessage id="about" />
      </h1>
    </div>
    <div className={styles.description}>
      <FormattedMessage id="projectDescription" />
    </div>
  </div>
);

export default AboutProject;
