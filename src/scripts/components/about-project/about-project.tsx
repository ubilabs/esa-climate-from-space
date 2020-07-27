import React, {FunctionComponent} from 'react';
import {FormattedMessage} from 'react-intl';
// import ReactMarkdown from 'react-markdown';

import styles from './about-project.styl';

const AboutProject: FunctionComponent = () => (
  <div className={styles.aboutProject}>
    <div className={styles.title}>
      <h1>
        <FormattedMessage id="about" />
      </h1>
    </div>
    <div className={styles.description}>
      Woher markdown?
      {/* <ReactMarkdown
        source={layer.description}
        linkTarget="_blank"
        allowedTypes={[
          'heading',
          'text',
          'paragraph',
          'break',
          'strong',
          'emphasis',
          'list',
          'listItem',
          'link'
        ]}
      /> */}
    </div>
  </div>
);

export default AboutProject;
