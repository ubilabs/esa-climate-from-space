import React, {FunctionComponent} from 'react';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';

import styles from './caption.styl';

interface Props {
  content: string;
  className?: string;
}

const Caption: FunctionComponent<Props> = ({content, className = ''}) => {
  const classes = cx(styles.caption, className);

  return (
    <div className={classes}>
      <div className={styles.content}>
        <ReactMarkdown
          source={content}
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

export default Caption;
