import React, {FunctionComponent} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import ReactMarkdown from 'react-markdown';

import styles from './about-project.styl';

const AboutProject: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.aboutProject}>
      <div className={styles.title}>
        <h1>
          <FormattedMessage id="about" />
        </h1>
      </div>
      <div className={styles.description}>
        <ReactMarkdown
          source={intl.formatMessage({id: 'projectDescription'})}
          linkTarget="_blank"
          allowedTypes={[
            'heading',
            'text',
            'paragraph',
            'break',
            'strong',
            'emphasis',
            'image',
            'imageReference',
            'list',
            'listItem'
          ]}
        />
      </div>
    </div>
  );
};

export default AboutProject;
