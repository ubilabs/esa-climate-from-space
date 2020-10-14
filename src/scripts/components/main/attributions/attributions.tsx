import React, {FunctionComponent} from 'react';
import {useIntl} from 'react-intl';
import ReactMarkdown from 'react-markdown';

import styles from './attributions.styl';

const Attributions: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div className={styles.attributions}>
      <div className={styles.credits}>
        <ReactMarkdown
          source={intl.formatMessage({id: 'attributionDescription'})}
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
            'listItem',
            'link'
          ]}
        />
      </div>
    </div>
  );
};

export default Attributions;
