import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import styles from './description.styl';

interface Props {
  description: string;
  className?: string;
}

const Description: FunctionComponent<Props> = ({
  description,
  className = ''
}) => {
  const classes = cx(styles.description, className);

  return (
    <div className={classes}>
      <div className={styles.content}>
        <ReactMarkdown
          source={description}
          allowedTypes={[
            'heading',
            'text',
            'paragraph',
            'break',
            'strong',
            'emphasis'
          ]}
        />
      </div>
    </div>
  );
};

export default Description;
