import React, {FunctionComponent} from 'react';
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
      <div className={styles.content}>{description}</div>
    </div>
  );
};

export default Description;
