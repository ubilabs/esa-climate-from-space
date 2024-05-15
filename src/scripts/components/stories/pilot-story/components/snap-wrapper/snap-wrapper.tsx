import React, {FunctionComponent} from 'react';
import cx from 'classnames';

import styles from './snap-wrapper.module.styl';

interface Props {
  snapPosition?: string;
  className?: string;
  children?: React.ReactElement | React.ReactElement[];
}

const SnapWrapper: FunctionComponent<Props> = ({
  snapPosition,
  className = '',
  children
}) => {
  const classes = cx(styles.snapWrapper, className);
  return (
    <div className={classes} style={{scrollSnapAlign: snapPosition}}>
      {children}
    </div>
  );
};

export default SnapWrapper;
